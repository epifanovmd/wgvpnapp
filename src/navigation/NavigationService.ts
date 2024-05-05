import {iocDecorator} from '@force-dev/utils';
import {iocHook} from '@force-dev/react-mobile';
import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import {log} from '../service';
import {ScreenName, ScreenParamList} from './navigation.types';
import {makeAutoObservable, runInAction} from 'mobx';
import {identity, pickBy} from 'lodash';
import {DebugVars} from '../../debugVars';

export const navigationRef = createNavigationContainerRef<ScreenParamList>();

export const INavigationService = iocDecorator<NavigationService>();
export const useNavigationService = iocHook(INavigationService);

const routesHistoryReduce = (arr: any[]) => {
  const result = arr.reduce((acc, item) => {
    acc.push(
      pickBy(
        {
          screen: item.name,
          params: item.params,
        },
        identity,
      ),
    );

    if (item.state) {
      return [
        ...acc,
        ...routesHistoryReduce([item.state.routes[item.state.index]]),
      ];
    }

    return acc;
  }, []) as {
    screen: ScreenName;
    params: ScreenParamList[ScreenName];
  }[];

  return result;
};

@INavigationService({inSingleton: true})
export class NavigationService {
  history: {screen: ScreenName; params: ScreenParamList[ScreenName]}[] = [];
  private _navigationRef = navigationRef;
  private _currentScreenName?: ScreenName = undefined;

  constructor() {
    makeAutoObservable(this, {}, {autoBind: true});

    this._navigationRef.addListener('state', e => {
      runInAction(() => {
        this._currentScreenName =
          this._navigationRef?.current?.getCurrentRoute()?.name as ScreenName;
        this.history = routesHistoryReduce(e.data.state?.routes || []);
      });

      if (DebugVars.logNavHistory) {
        log.debug('Nav Current Screen', this._currentScreenName);
        log.debug('Nav History -> ', JSON.stringify(this.history));
      }
    });
  }

  public get currentScreenName() {
    return this._currentScreenName;
  }

  get isReady() {
    return this._navigationRef.isReady();
  }

  get canGoBack() {
    return this.isReady && this._navigationRef.canGoBack();
  }

  goBack() {
    if (this.canGoBack) {
      this._navigationRef.goBack();
    }
  }

  navigateTo: typeof navigationRef.navigate = (...args: any) => {
    if (this.isReady) {
      this._navigationRef.navigate(...args);
    }
  };

  replaceTo = <T extends ScreenName>(name: T, params: ScreenParamList[T]) => {
    if (this.isReady) {
      this._navigationRef.dispatch(StackActions.replace(name, params));
    }
  };

  pushTo = <T extends ScreenName>(name: T, params: ScreenParamList[T]) => {
    if (this.isReady) {
      this._navigationRef.dispatch(StackActions.push(name, params));
    }
  };
}

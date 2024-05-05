import {Row} from '@force-dev/react-mobile';
import React, {FC, memo} from 'react';
import {
  Button,
  Container,
  Content,
  Header,
  SwitchTheme,
  Text,
} from '../../../components';
import {AppScreenProps} from '../../../navigation';

import {NativeModules} from 'react-native';

const {WGVpnAppTestModule} = NativeModules;

console.log('RNAppTestManager', WGVpnAppTestModule);

console.log('RNAppTestModule log', WGVpnAppTestModule.log());

WGVpnAppTestModule.detectVPN().then(res => console.log('detectVPN', res));

console.log('isVpnActive', WGVpnAppTestModule.isVpnActive());

interface IProps extends AppScreenProps {}

export const Playground: FC<IProps> = memo(({navigation, route}) => {
  return (
    <Container pa={16}>
      <Header />

      <Content>
        <Row mb={32}>
          <Text>{route.name}</Text>
          <SwitchTheme marginLeft={'auto'} />
        </Row>
        <Button
          mt={8}
          title={'Notifications'}
          onPress={() => navigation.navigate('Notifications')}
        />

        <Button
          mt={8}
          title={'Components'}
          onPress={() => navigation.navigate('Components')}
        />

        <Button
          mt={8}
          title={'Pickers'}
          onPress={() => navigation.navigate('Pickers')}
        />
      </Content>
    </Container>
  );
});

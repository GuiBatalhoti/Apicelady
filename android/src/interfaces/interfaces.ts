import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';

export interface ScreenProps {
    navigation: DrawerNavigationProp<ParamListBase>;
}
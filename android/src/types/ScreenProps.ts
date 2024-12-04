import { ParamListBase } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export interface ScreenProps {
    navigation: DrawerNavigationProp<ParamListBase>;
}
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
// Components
import Home from './containers/Home/Home'
import Start from './containers/Start/Start'
import Scanner from './containers/Scanner/Scanner'
import Food from './containers/Food/Food'
import List from './containers/List/List'
import Payment from './containers/Payment/Payment'
import Settings from './containers/Settings/Settings'

const MainNavigator = createStackNavigator(
	{
		Home: { screen: Home },
		Start: { screen: Start },
		Scanner: { screen: Scanner },
		Food: { screen: Food },
		List: { screen: List },
		Payment: { screen: Payment },
		Settings: { screen: Settings },
	},
	{
		initialRouteName: 'Home',
		headerMode: 'none',
	},
)

const router = createAppContainer(MainNavigator)

export default router

import { Dimensions, Platform } from 'react-native';

/* helper functions */
export function getFileExtension3(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export function capitalizeFirstLetter(value) {
  return value
    .charAt(0)
    .toUpperCase() + value.slice(1);
}

export function getKeyByValue(array, value) {
  for (let prop in array) {
    if (array.hasOwnProperty(prop)) {
      if (array[prop] === value) {
        return prop;
      }
    }
  }
  return null;
}
// gets the current screen from navigation state
export function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

export function validatePassword(password) {
  const pwdRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  return pwdRegex.test(password);
}

// export function getActiveRouteIndex(navigationState) {   if
// (!navigationState) {     return null;   }   const route =
// navigationState.routes[navigationState.index];   // dive into nested
// navigators   if (route.routes) {     return getActiveRouteName(route);   }
// return route.index; }

export function screenHeight(percentageHeight, offset) {
  return (Dimensions.get('window').height * (percentageHeight / 100)) - offset;
}
export function screenWidth(percentageWidth, offset) {
  return (Dimensions.get('window').width * (percentageWidth / 100)) - offset;
}

export function validateEmail(email) {
  const re = new RegExp([
    '^(([^<>()\\[\\]\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\.,;:\\s@"]+)*)', '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])', '|(([a-zA-ZÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð:\'' +
    ' + \-0-9]+\\.)',
    '+[a-zA-ZÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð:]{2,' +
    '}))$'
  ].join(''));
  return re.test(email);
}

export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
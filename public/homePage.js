const logout = new LogoutButton();

logout.action = () => {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
    });
};

ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const rates = new RatesBoard();

getRates = () => ApiConnector.getStocks((response) => {
   if (response.success) {
       rates.clearTable();
       rates.fillTable(response.data);
   }
});

getRates();

const intervalRatesId = setInterval(getRates,60000);

const money = new MoneyManager();

money.addMoneyCallback = (data) => {
    ApiConnector.addMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(false, 'Пополнение баланса прошло успешно!');
        } else {
            money.setMessage(true, response.data);
        }
    })
};

money.conversionMoneyCallback = (data) => {
    ApiConnector.convertMoney(data, (response) => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            money.setMessage(false, 'Конвертация валют прошла успешно!');
        } else {
            money.setMessage(true, response.data);
        }
    })
};

money.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
      if (response.success) {
          ProfileWidget.showProfile(response.data);
          money.setMessage(false, 'Перевод денег прошел успешно!');
      } else {
          money.setMessage(true, response.data);
      }
  })
};

const favorites = new FavoritesWidget();

updateFavorites = (response) => {
    favorites.clearTable();
    favorites.fillTable(response.data);
    money.updateUsersList(response.data);
};

ApiConnector.getFavorites((response) => {
    if (response.success) {
        updateFavorites(response);
    }
});

favorites.addUserCallback = (data) => {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            updateFavorites(response);
            favorites.setMessage(false, 'Пользователь успешно добавлен!');
        } else {
            favorites.setMessage(true, response.data);
        }
    })
};

favorites.removeUserCallback = (data) => {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            updateFavorites(response);
        } else {
            favorites.setMessage(true, response.data);
        }
    })
};
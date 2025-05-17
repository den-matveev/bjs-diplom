const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();
const msInMinute = 60000;

logoutButton.action = () => {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    });
}

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

function getRates() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable();
            ratesBoard.fillTable(response.data);
        }
    });
}

setInterval(getRates, msInMinute);

moneyManager.addMoneyCallback = data => {
    ApiConnector.addMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(true, 'Деньги успешно зачислены');
            ProfileWidget.showProfile(response.data);
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

moneyManager.conversionMoneyCallback = data => {
    ApiConnector.convertMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(true, 'Конвертация прошла успешно');
            ProfileWidget.showProfile(response.data);
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

moneyManager.sendMoneyCallback = data => {
    ApiConnector.transferMoney(data, response => {
        if (response.success) {
            moneyManager.setMessage(true, 'Перевод прошёл успешно');
            ProfileWidget.showProfile(response.data);
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

ApiConnector.getFavorites(response => {
    if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
    }
});

favoritesWidget.addUserCallback = data => {
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, `Пользователь добавлен в избранное`);
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}

favoritesWidget.removeUserCallback = data => {
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            moneyManager.setMessage(true, `Пользователь удалён из избранного`);
        } else {
            moneyManager.setMessage(false, response.error);
        }
    });
}
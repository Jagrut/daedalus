import { expect } from 'chai';

const getNameOfActiveWalletInSidebar = async function() {
  await this.client.waitForVisible('.SidebarWalletMenuItem_active');
  return await this.client.getText('.SidebarWalletMenuItem_active .SidebarWalletMenuItem_title');
};

const expectActiveWallet = async function(walletName) {
  const displayedWalletName = await getNameOfActiveWalletInSidebar.call(this);
  expect(displayedWalletName.toLowerCase().trim()).to.equal(walletName.toLowerCase().trim());
};

export default function () {

  this.Given(/^I have a wallet$/, async function () {
    const result = await this.client.executeAsync(function(done) {
      // This assumes that we always have a default wallet on the backend!
      daedalus.api.getWallets().then((wallets) => done(wallets[0]));
    });
    this.wallet = result.value;
  });

  this.Given(/^I have the following wallets:$/, async function (table) {
    const result = await this.client.executeAsync(function(wallets, done) {
      window.Promise.all(wallets.map((wallet) => {
        return daedalus.api.createWallet({
          name: wallet.name,
          mnemonic: daedalus.api.generateMnemonic().join(' ')
        });
      }))
      .then(done)
      .catch((error) => done(error.stack));
    }, table.hashes());
    this.wallets = result.value;
  });

  this.Given(/^I am on the (.*) wallet$/, async function (walletName) {
    const wallet = this.wallets.filter((wallet) => wallet.name === walletName)[0];
    await this.navigateTo(`/wallets/${wallet.id}/home`);
    return expectActiveWallet.call(this, walletName);
  });

  this.Given(/^I am on the wallet (.*) screen$/, async function(screen) {
    await this.navigateTo(`/wallets/${this.wallet.id}/${screen}`);
    expectActiveWallet.call(this, this.wallet.name);
  });

  this.Given(/^I see the create wallet dialog$/, function () {
    return this.client.waitForVisible('.WalletCreateDialog');
  });

  this.Given(/^I dont see the create wallet dialog(?: anymore)?$/, function () {
    return this.client.waitForVisible('.WalletCreateDialog', null, true);
  });

  this.When(/^I click on the (.*) wallet in the sidebar$/, function (walletName) {
    return this.client.click(`//*[contains(text(), "${walletName}") and @class="SidebarWalletMenuItem_title"]`);
  });

  this.When(/^I click the wallet (.*) button$/, async function (buttonName) {
    const buttonSelector = `.WalletNavButton_component.${buttonName}`;
    await this.client.waitForVisible(buttonSelector);
    await this.client.click(buttonSelector);
  });

  this.When(/^I fill out the wallet send form with:$/, async function (table) {
    const values = table.hashes()[0];
    const formSelector = '.WalletSendForm_fields';
    await this.client.setValue(`${formSelector} .title .input_inputElement`, values.title);
    await this.client.setValue(`${formSelector} .receiver .input_inputElement`, values.receiver);
    await this.client.setValue(`${formSelector} .amount .input_inputElement`, values.amount);
    await this.client.setValue(`${formSelector} .description .input_inputElement`, values.description);
    this.walletSendFormValues = values;
  });

  this.When(/^I submit the wallet send form$/, async function () {
    const submitButton = '.WalletSendForm_submitButton';
    await this.client.waitForVisible(submitButton);
    return this.client.click(submitButton);
  });

  this.When(/^I submit the create wallet dialog with the following inputs:$/, async function (table) {
    const fields = table.hashes()[0];
    await this.client.setValue('.WalletCreateDialog .walletName input', fields.walletName);
    return this.client.click('.WalletCreateDialog .dialog_button');
  });

  this.Then(/^I should be on some wallet page$/, async function () {
    return this.client.waitForVisible('.WalletNavigation_component');
  });

  // TODO: Refactor this to include previous step definition
  this.Then(/^I should be on the(.*)? wallet (.*) screen$/, async function (walletName, screenName) {
    if (walletName) await expectActiveWallet.call(this, walletName);
    return this.client.waitForVisible(`.WalletNavButton_active.${screenName}`);
  });

  this.Then(/^I should see the following error messages on the wallet send form:$/, async function (data) {
    let errorsOnScreen = await this.client.getText('.WalletSendForm_fields .input_error');
    if (typeof errorsOnScreen === 'string') errorsOnScreen = [errorsOnScreen];
    const errors = data.hashes();
    for (let i=0; i < errors.length; i++) {
      const expectedError = await this.intl(errors[i].message);
      expect(errorsOnScreen[i]).to.equal(expectedError);
    }
  });

  this.Then(/^I should see the wallet home screen with the transaction titled (.*)$/, async function (title) {
    const displayedWalletName = await getDisplayedWalletName.call(this);
    expect(displayedWalletName.toLowerCase()).to.equal(this.wallet.name.toLowerCase());
    const transactionTitle = await this.client.getText('.Transaction_title');
    expect(transactionTitle).to.equal(title);
    const transactionType = await this.client.getText('.Transaction_type');
    expect(transactionType).to.equal('ADA transaction');
    const transactionAmount = await this.client.getText('.Transaction_amount');
    expect(transactionAmount).to.equal(`-${this.walletSendFormValues['amount']} ada`);
  });

};

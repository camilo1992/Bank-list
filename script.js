'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  //  this action is gonna gelp us clean the previous inuts in our originat html.
  //  it works as a .textcontent
  containerMovements.innerHTML = ``;
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((move, i) => {
    const type = move > 0 ? `deposit` : `withdrawal`;
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${move}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

const calacDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);

  labelBalance.textContent = `${acc.balance} €`;
};
// calacDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const deposit = acc.movements
    .filter(cur => cur > 0)
    .reduce((cur, mov) => cur + mov);
  labelSumIn.textContent = `${deposit} €`;

  const withdrawal = acc.movements
    .filter(cur => cur < 0)
    .reduce((cur, mov) => cur + mov);

  labelSumOut.textContent = `${Math.abs(withdrawal)} €`;

  const interest = acc.movements
    .filter(cur => cur > 0)
    .map(cur => (cur * 1.2) / 100)
    .filter((cur, i, arr) => {
      // console.log(arr);
      return cur > 1;
    })
    .reduce((acc, cur) => acc + cur);

  labelSumInterest.textContent = `${interest} €`;
};
// calcDisplaySummary(account1.movements);

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(` `)
      .map(el => el[0])
      .join(``);
  });
};
createUserName(accounts);

const updateUI = function (acc) {
  // Calculate and display balance
  calacDisplayBalance(acc);

  // Calculate and display summary
  calcDisplaySummary(acc);

  // Display movements
  displayMovements(acc);
};

//   EVENT HANDLERS .....
let currentAccount;
btnLogin.addEventListener(`click`, function (e) {
  e.preventDefault();
  sorted = false;

  currentAccount = accounts.find(
    cur => cur.userName === inputLoginUsername.value.trim()
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message ...
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100; // this is going to display the UI using the opacity property set in css.
    inputLoginPin.value = inputLoginUsername.value = ``; // this is going to celar the fields.
    inputLoginPin.blur(); // it is gonna take away the focus(pointer)off the pin field

    // update UI
    updateUI(currentAccount);
  }
});

//  in order to se the reques loan functionality, we need to check first if
// there has been a deposit of at least 10 % of the amount requested.
btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //  Add the movment.
    currentAccount.movements.push(amount);

    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = ``;
  inputLoanAmount.blur();
});

btnTransfer.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts?.find(
    cur => cur.userName === inputTransferTo.value.trim()
  );
  // console.log(reciverAcc);

  if (
    amount > 0 &&
    reciverAcc &&
    amount < currentAccount.balance &&
    reciverAcc?.userName !== currentAccount.userName
  ) {
    // transaction output
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    // update de UI.
    updateUI(currentAccount);
  } else {
    alert(`Enter a valid inpunt or There are not enough funds`);
  }

  inputTransferAmount.value = inputTransferTo.value = ``;
  inputTransferAmount.blur();
});

btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();
  //firt step, check credentials..
  // ( check if the current user and pin mathces the inf in the close)
  if (
    inputCloseUsername.value.trim() === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const closeAcc = accounts.findIndex(
      cur => cur.userName === inputCloseUsername.value.trim()
    );
    accounts.splice(closeAcc, 1);
    console.log(accounts);
  }
  //  log out user (hide UI)
  containerApp.style.opacity = 0;
});

let sorted = false;
btnSort.addEventListener(`click`, function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

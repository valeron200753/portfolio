// 1. const і let

// У JavaScript змінна — це місце, де ми зберігаємо значення.

// const name = "Tokyo";
// let age = 22;

// console.log(name);
// console.log(age);

// Головна різниця:

// const name = "Tokyo";
// name = "Valerii"; // ❌ помилка

// const не дозволяє переприсвоїти значення.

// А:

// let age = 22;
// age = 23; // ✅

// Тому просте правило:

// Використовуй const за замовчуванням. let — коли значення реально буде змінюватися.

// Наприклад:

// const birthYear = 2004;

// let score = 0;
// score = score + 10;

//////////////////////////////////////////////////////////////////////////////



// 2. Типи даних

// Основні типи, які зараз потрібні:

// const username = "Tokyo";     // string
// const age = 22;               // number
// const isDeveloper = true;     // boolean
// const emptyValue = null;      // null
// let something;                // undefined

// Перевірити тип:

// console.log(typeof username);
// console.log(typeof age);
// console.log(typeof isDeveloper);

// Отримаємо:

// string
// number
// boolean





// const name = "Tokyo";
// const age = 22;
// const city = "Kherson";
// const learningFullStack = true;

// console.log(name);
// console.log(age);
// console.log(city);
// console.log(learningFullStack);



///////////////////////////////////////////////////////////////////
// 3. Рядки та template literals

// Можна написати:

// const name = "Tokyo";
// const age = 22;

// console.log("My name is " + name + " and I am " + age + " years old.");

// Але сучасніше і зручніше:

// console.log(`My name is ${name} and I am ${age} years old.`);

// Оці:

// ` `

// називаються backticks.

// А:

// ${name}

// вставляє значення змінної в рядок.

// Для нашого портфоліо ми це будемо використовувати постійно.

/////////////////////////////////////////////////////////////////////////////////
// 4. Оператори

// Математика:

// const a = 10;
// const b = 5;

// console.log(a + b);
// console.log(a - b);
// console.log(a * b);
// console.log(a / b);

// Порівняння:

// console.log(10 > 5);   // true
// console.log(10 < 5);   // false

// console.log(10 === 10); // true
// console.log(10 !== 5);  // true

// Особливо запам'ятай:

// ===

// Це порівняння.

// А:

// =

// це присвоєння.

// Тобто:

// const age = 22;

// але:

// age === 22

// означає:

// age дорівнює 22?
///////////////////////////////////////////////////////////////////////////////
// 5. if / else

// Одна з найважливіших речей у програмуванні.

// const age = 22;

// if (age >= 18) {
//     console.log("You are an adult");
// } else {
//     console.log("You are under 18");
// }

// Логіка:

// умова
//  ↓
// true?
//  ├── yes → виконуємо if
//  └── no  → виконуємо else

// Можемо мати кілька умов:

// const score = 85;

// if (score >= 90) {
//     console.log("Excellent");
// } else if (score >= 70) {
//     console.log("Good");
// } else {
//     console.log("Keep learning");
// }
///////////////////////////////////////////////////////////////
// 6. && та ||

// && означає AND / І.

// const age = 22;
// const hasLicense = true;

// if (age >= 18 && hasLicense === true) {
//     console.log("You can drive");
// }

// Обидві умови повинні бути true.

// || означає OR / АБО.

// const isAdmin = false;
// const isOwner = true;

// if (isAdmin || isOwner) {
//     console.log("Access granted");
// }

// Достатньо хоча б однієї true.
////////////////////////////////////////////////////////////////////////////////
// 7. Функції

// Тепер дуже важлива концепція.

// Замість:

// console.log("Hello, Tokyo!");
// console.log("Hello, Alex!");
// console.log("Hello, Diana!");

// можемо створити функцію:

// function greet(name) {
//     console.log(`Hello, ${name}!`);
// }

// І викликати:

// greet("Tokyo");
// greet("Alex");
// greet("Diana");

// Тобто:

// function
// ↓
// шматок коду, який можна використовувати багато разів

// Функція також може повертати результат:

// function add(a, b) {
//     return a + b;
// }

// const result = add(5, 10);

// console.log(result);

// Результат:

// 15

// Різниця дуже важлива:

// console.log()

// просто щось показує.

// А:

// return

// повертає значення з функції.

//////////////////////////////////////////////////////////////////////////////////
// const name='Tokyo';
// const age = 22;
// const profession ='Fukk-stack';
// console.log(`Hello,my name is ${name} ,I am ${age} years old and I am learning ${profession} Development`);



// const age=22;
//  if(age>=18){
//     console.log('Access granted');
//  }
//  else{
//     console.log('Access denied');
//  }



// const number=15;
// if(number>10){
//     console.log(`Number is greater than 10`)
// }
// else{
//     console.log(`Number is 10 or less`);
// }





// function multiply(a,b){
//     return a*b;
// }
// console.log(multiply(5, 4));


// function checkAge(age) {
//     if(age>=18){
//        return `Adult`;

//     }
//     else{
//        return `Minor`;
//     }
// }
// console.log(checkAge(22));
// console.log(checkAge(15));



// const username = "Tokyo";
// const password = "12345";

// function login(username, password){
//     if ( username === "Tokyo" && password === "12345"){
//         console.log(`Login successful`);
//     }
//     else{
//         console.log(`Invalid username or password`);
//     }
// }
// login(username,password);


////////////////////////////////////////////////////

// const skills = ["HTML", "CSS", "JavaScript", "Git"];
// skills.push("Linux");
// for(const skill of skills){
//     console.log(skill);
// }

// const developer = {
//     name: "Tokyo",
//     age: 22,
//     skills: ["HTML", "CSS", "JavaScript"]
// };
// console.log(`${developer.name} knows ${developer.skills[2]}`);

// const numbers = [1, 2, 3, 4, 5];

// const desatki = numbers.map(
//     function(number){
//         return number * 10;
//     });
//     console.log(desatki);

// const ages = [15, 18, 21, 16, 30, 12];
// const adult = ages.filter(age => age >=18);
// console.log(adult);

const projects = [
    { id: 1, title: "Portfolio" },
    { id: 2, title: "Task Manager" },
    { id: 3, title: "Weather App" }
];

const project = projects.find(project => project.id === 2);
console.log(project.title);

const technologies = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js"
];

const longTechnologies = technologies.filter(
    technology => technology.length > 4
);

console.log(longTechnologies);

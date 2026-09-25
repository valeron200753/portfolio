async function getUsers() {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error("Request failed");
        }

        const data = await response.json();

        // 1. Вивести всі імена
        for (const user of data) {
            console.log(user.name);
        }

        // 2. Користувачі з id > 5
        const usersAboveFive = data.filter(
            user => user.id > 5
        );

        for (const user of usersAboveFive) {
            console.log(user.name);
        }

        // 3. Знайти користувача з id === 3
        const thirdUser = data.find(
            user => user.id === 3
        );

        console.log(thirdUser.name);

    } catch (error) {
        console.log("Something went wrong");
    }
}

getUsers();
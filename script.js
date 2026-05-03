document.addEventListener("DOMContentLoaded", () => {

    const balanceDisplay = document.getElementById("balance");
    const descriptionInput = document.getElementById("description");
    const amountInput = document.getElementById("amount"); 

    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    function updateUI() {
        const totalBalance = transactions.reduce((total, t) => total + t.amount, 0);
        const totalIncome = transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        balanceDisplay.textContent = totalBalance.toFixed(2);
        document.getElementById("totalIncome").textContent = "$" + totalIncome.toFixed(2);
        document.querySelector(".exs p:nth-child(2)").textContent = "$" + totalExpense.toFixed(2);

        const incomeItems = transactions.filter(t => t.amount > 0);
        const expenseItems = transactions.filter(t => t.amount < 0);

        const incomeList = document.getElementById("incomeList");
        incomeList.innerHTML = "";
        incomeItems.forEach((t, index) => {
            const originalIndex = transactions.indexOf(t);
            const li = document.createElement("li");
            li.innerHTML = `
                ${t.description}: $${t.amount.toFixed(2)}
                <button class="delete-button" data-index="${originalIndex}">x</button>
            `;
            incomeList.appendChild(li);
        });

        const expenseList = document.getElementById("expenseList");
        expenseList.innerHTML = "";
        expenseItems.forEach((t) => {
            const originalIndex = transactions.indexOf(t);
            const li = document.createElement("li");
            li.innerHTML = `
                ${t.description}: $${t.amount.toFixed(2)}
                <button class="delete-button" data-index="${originalIndex}">x</button>
            `;
            expenseList.appendChild(li);
        });


        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", deleteTransaction);
        });
    }

    function addTransaction() {
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());

        if (description === "" || isNaN(amount)) {
            alert("Please provide valid inputs");
            return;
        }

        transactions.push({ description, amount });
        localStorage.setItem("transactions", JSON.stringify(transactions));

        descriptionInput.value = "";
        amountInput.value = "";
        updateUI();
    }

    function deleteTransaction(event) {
        const index = event.target.getAttribute("data-index");
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateUI();
    }

    document.getElementById("addTransactions").addEventListener("click", addTransaction);

    updateUI();
});
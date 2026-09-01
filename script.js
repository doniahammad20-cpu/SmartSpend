function scrollToDashboard() {

    document
        .getElementById("dashboard")
        .scrollIntoView({

            behavior: "smooth"

        });

}


async function analyzeMoney() {


    const income =

        document
        .getElementById("income")
        .value;


    const expenses =

        document
        .getElementById("expenses")
        .value;


    if (

        income === "" ||

        expenses === ""

    ) {


        alert(

            "Please enter income and expenses!"

        );


        return;

    }


    try {


        const response =

            await fetch(

                "/analyze",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":

                        "application/json"

                    },


                    body:

                    JSON.stringify({

                        income: income,

                        expenses: expenses

                    })

                }

            );


        const data =

            await response.json();


        document
            .getElementById("incomeDisplay")
            .innerText =

            data.income;


        document
            .getElementById("expensesDisplay")
            .innerText =

            data.expenses;


        document
            .getElementById("savingsDisplay")
            .innerText =

            data.savings;


        document
            .getElementById("score")
            .innerText =

            data.score;


        document
            .getElementById("message")
            .innerText =

            data.message;


    }

    catch (error) {


        alert(

            "Something went wrong!"

        );


    }


}



async function convertCurrency() {


    const amount =

        document
        .getElementById("amount")
        .value;


    const fromCurrency =

        document
        .getElementById("fromCurrency")
        .value;


    const toCurrency =

        document
        .getElementById("toCurrency")
        .value;


    if (amount === "") {


        alert(

            "Please enter an amount!"

        );


        return;

    }


    const resultElement =

        document
        .getElementById(
            "conversionResult"
        );


    resultElement.innerText =

        "Converting...";


    try {


        const response =

            await fetch(

                "/convert",

                {

                    method: "POST",

                    headers: {

                        "Content-Type":

                        "application/json"

                    },


                    body:

                    JSON.stringify({

                        amount: amount,

                        from: fromCurrency,

                        to: toCurrency

                    })

                }

            );


        const data =

            await response.json();


        if (data.error) {


            resultElement.innerText =

                "Conversion failed!";


            return;

        }


        resultElement.innerText =

            `${amount} ${fromCurrency} = 
            ${data.result} ${toCurrency}`;


    }

    catch (error) {


        resultElement.innerText =

            "Error connecting to server!";

    }


}
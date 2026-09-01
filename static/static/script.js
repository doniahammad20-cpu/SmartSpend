let totalIncome = 0;
let totalExpenses = 0;

document.addEventListener('DOMContentLoaded', function() {
    // التعامل مع نموذج إضافة العمليات المالية
    const financeForm = document.getElementById('finance-form');
    if (financeForm) {
        financeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const type = document.getElementById('type').value;
            const amount = parseFloat(document.getElementById('amount').value);

            if (isNaN(amount) || amount <= 0) return;

            if (type === 'income') {
                totalIncome += amount;
            } else {
                totalExpenses += amount;
            }

            updateDashboard();

            // إعادة إرجاع الخانات للحالة الفارغة
            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
        });
    }

    // التعامل مع تحويل العملات
    const convertBtn = document.getElementById('convert-btn');
    if (convertBtn) {
        convertBtn.addEventListener('click', function() {
            const amountInput = document.getElementById('convert-amount');
            const fromSelect = document.getElementById('from-currency');
            const toSelect = document.getElementById('to-currency');
            const resultBox = document.getElementById('conversion-result');

            const amount = parseFloat(amountInput.value);
            const from = fromSelect.value;
            const to = toSelect.value;

            const rates = {
                'USD': 1,
                'EUR': 0.92,
                'ILS': 3.65
            };

            if (isNaN(amount) || amount <= 0) {
                resultBox.innerText = 'يرجى إدخال مبلغ صحيح';
                return;
            }

            const amountInUSD = amount / rates[from];
            const result = amountInUSD * rates[to];

            resultBox.innerText = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
        });
    }
});

// تحديث القيم في لوحة التحكم وحساب المؤشر
function updateDashboard() {
    document.getElementById('total-income').innerText = `$${totalIncome}`;
    document.getElementById('total-expenses').innerText = `$${totalExpenses}`;

    const savings = totalIncome - totalExpenses;
    document.getElementById('expected-savings').innerText = `$${savings}`;

    // حساب مؤشر الصحة المالية
    let healthScore = 100;
    if (totalIncome > 0) {
        const expenseRatio = (totalExpenses / totalIncome) * 100;
        healthScore = Math.max(0, Math.round(100 - expenseRatio));
    } else if (totalExpenses > 0) {
        healthScore = 0;
    }

    document.getElementById('financial-health').innerText = `${healthScore} / 100`;
}

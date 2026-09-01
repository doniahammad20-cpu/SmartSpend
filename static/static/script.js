let totalIncome = 0;
let totalExpenses = 0;

// التعامل مع نموذج إضافة العمليات المالية
document.getElementById('finance-form').addEventListener('submit', function(e) {
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
    document.getElementById('category').value = '';
});

// تحديث القيم في لوحة التحكم وحساب المؤشر
function updateDashboard() {
    document.getElementById('total-income').textContent = `$${totalIncome}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses}`;

    const savings = totalIncome - totalExpenses;
    document.getElementById('total-savings').textContent = `$${savings}`;

    // حساب مؤشر الصحة المالية
    let score = 0;
    let message = "";

    if (totalIncome > 0) {
        const savingsRatio = (savings / totalIncome) * 100;
        if (savingsRatio >= 30) {
            score = 95;
            message = "وضعك المالي ممتازة ومعدل الادخار عالي جداً! 🌟";
        } else if (savingsRatio > 0) {
            score = 70;
            message = "وضعك المالي جيد، حاول تقليل المصاريف لزيادة الادخار. 👍";
        } else {
            score = 30;
            message = "تحذير: مصاريفك تتجاوز دخلك الشهري! ⚠️";
        }
    } else {
        score = 0;
        message = "أدخل بياناتك المالية لحساب المؤشر.";
    }

    document.getElementById('health-score').textContent = `${score} / 100`;
    document.getElementById('health-message').textContent = message;
}

// حاسبة تحويل العملات المباشرة مع أسعار احتياطية ثابتة عند التعثر
async function convertCurrency() {
    const amountInput = document.getElementById('convert-amount').value;
    const amount = parseFloat(amountInput);
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
    const resultBox = document.getElementById('convert-result');

    if (isNaN(amount) || amount <= 0) {
        resultBox.textContent = "يرجى إدخال مبلغ صحيح.";
        return;
    }

    if (from === to) {
        resultBox.textContent = `${amount} ${from} = ${amount.toFixed(2)} ${to}`;
        return;
    }

    resultBox.textContent = "جاري التحويل...";

    // أسعار صرف احتياطية شائعة (Fallback rates)
    const fallbackRates = {
        'USD_ILS': 3.65,
        'ILS_USD': 0.27,
        'EUR_ILS': 3.95,
        'ILS_EUR': 0.25,
        'USD_EUR': 0.92,
        'EUR_USD': 1.09
    };

    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
        const data = await response.json();
        
        if (data && data.rates && data.rates[to]) {
            const rate = data.rates[to];
            const converted = (amount * rate).toFixed(2);
            resultBox.textContent = `${amount} ${from} = ${converted} ${to}`;
            return;
        }
        throw new Error("Rate not found");
    } catch (error) {
        // في حال تعثر الـ API يتم التحويل باستخدام أسعار الصرف الاحتياطية مباشرة
        const key = `${from}_${to}`;
        if (fallbackRates[key]) {
            const converted = (amount * fallbackRates[key]).toFixed(2);
            resultBox.textContent = `${amount} ${from} = ${converted} ${to}`;
        } else {
            resultBox.textContent = "تعذر الحصول على سعر الصرف حالياً.";
        }
    }
}
// قسم تحويل العملات
const convertBtn = document.getElementById('convert-btn');
if (convertBtn) {
    convertBtn.addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('convert-amount').value);
        const from = document.getElementById('from-currency').value;
        const to = document.getElementById('to-currency').value;
        
        const rates = {
            'USD': 1,
            'EUR': 0.92,
            'ILS': 3.65
        };

        if (isNaN(amount) || amount <= 0) {
            document.getElementById('conversion-result').innerText = 'يرجى إدخال مبلغ صحيح';
            return;
        }

        const amountInUSD = amount / rates[from];
        const result = amountInUSD * rates[to];

        document.getElementById('conversion-result').innerText = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
    });
}

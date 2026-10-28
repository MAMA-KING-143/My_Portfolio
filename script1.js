
const form = document.getElementById("searchForm");
const input = document.getElementById("userInput");

const statusBox = document.getElementById("status");
const resultCount = document.getElementById("resultCount");

const maleResults = document.getElementById("maleResults");
const femaleResults = document.getElementById("femaleResults");

const maleCount = document.getElementById("maleCount");
const femaleCount = document.getElementById("femaleCount");

document.getElementById("year").textContent =
    new Date().getFullYear();


// সার্চের লেখা স্বাভাবিক করা
function normalize(value) {
    return value
        .toLocaleLowerCase("bn")
        .replace(/\s+/g, " ")
        .trim();
}


// খালি মেসেজ দেখানো
function showEmpty(container, message) {
    container.replaceChildren();

    const empty = document.createElement("div");

    empty.className = "empty-state";
    empty.textContent = message;

    container.appendChild(empty);
}


// একটি ভোটার রেকর্ড দেখানো
function addRecord(container, record, label, tagClass) {

    const card = document.createElement("article");

    card.className = "result-card";


    // Male অথবা Female ট্যাগ
    const tag = document.createElement("span");

    tag.className = `tag ${tagClass}`;
    tag.textContent = label;

    card.appendChild(tag);


    // রেকর্ড নম্বর বের করা
    // বাংলা ও ইংরেজি দুই ধরনের সংখ্যা কাজ করবে
    const numberMatch = record.match(
        /^\s*\[([০-৯0-9]+)\./
    );

    if (numberMatch) {

        const numberBox = document.createElement("div");

        numberBox.className = "voter-number";
        numberBox.textContent = numberMatch[1];

        card.appendChild(numberBox);
    }


    // বাকি তথ্য দেখানো
    const details = document.createElement("div");

    details.className = "voter-details";

    details.textContent = record.replace(
        /^\s*\[[০-৯0-9]+\.\s*/,
        ""
    );

    card.appendChild(details);

    container.appendChild(card);
}


// GitHub TXT ফাইল থেকে সার্চের ফলাফল আনা
async function loadMatches(url, query) {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();

    return text
        .split("[")
        .filter(block => block.trim())
        .map(block => "[" + block.trim())
        .filter(record => normalize(record).includes(query));
}


// সার্চ বাটনে ক্লিক করলে
form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const query = normalize(input.value);


    // কিছু লেখা না থাকলে
    if (!query) {

        showEmpty(
            maleResults,
            "সার্চ করার জন্য নাম বা তথ্য লিখুন।"
        );

        showEmpty(
            femaleResults,
            "সার্চ করার জন্য নাম বা তথ্য লিখুন।"
        );

        maleCount.textContent = "০";
        femaleCount.textContent = "০";

        resultCount.textContent = "০টি ফলাফল";

        statusBox.textContent =
            "❌ নাম বা তথ্য না লিখে সার্চ করা সম্ভব নয়!";

        return;
    }


    // সার্চ চলার সময়
    showEmpty(maleResults, "Male List খোঁজা হচ্ছে...");
    showEmpty(femaleResults, "Female List খোঁজা হচ্ছে...");

    maleCount.textContent = "…";
    femaleCount.textContent = "…";
    resultCount.textContent = "…";

    statusBox.textContent =
        "🔍 Male ও Female ডাটাবেস চেক করা হচ্ছে...";


    // দুটি আলাদা TXT ফাইল
    const files = [

        {
            url: "https://raw.githubusercontent.com/MAMA-KING-143/VOTER_LIST/refs/heads/main/voter(male).txt",

            label: "MALE LIST",
            css: "male-tag",

            container: maleResults,
            countElement: maleCount
        },

        {
            url: "https://raw.githubusercontent.com/MAMA-KING-143/VOTER_LIST/refs/heads/main/voter(female).txt",

            label: "FEMALE LIST",
            css: "female-tag",

            container: femaleResults,
            countElement: femaleCount
        }

    ];


    let total = 0;
    let loaded = 0;

    let maleMatches = 0;
    let femaleMatches = 0;


    // প্রতিটি তালিকা আলাদাভাবে সার্চ
    for (const file of files) {

        try {

            const records = await loadMatches(
                file.url,
                query
            );

            loaded++;

            file.container.replaceChildren();


            // ফলাফল পাওয়া না গেলে
            if (records.length === 0) {

                showEmpty(
                    file.container,
                    "এই তালিকায় কোনো তথ্য পাওয়া যায়নি।"
                );

            } else {

                // ফলাফলগুলো শুধু সংশ্লিষ্ট কলামে যোগ হবে
                records.forEach(record => {

                    addRecord(
                        file.container,
                        record,
                        file.label,
                        file.css
                    );

                });

            }


            file.countElement.textContent =
                String(records.length);

            total += records.length;


            // Male ও Female-এর সংখ্যা আলাদা রাখা
            if (file.css === "male-tag") {

                maleMatches = records.length;

            } else {

                femaleMatches = records.length;

            }

        } catch (error) {

            console.error(
                "TXT ফাইল লোড করা যায়নি:",
                error
            );

            showEmpty(
                file.container,
                "⚠️ TXT ফাইল লোড হয়নি। GitHub-এর ফাইলের নাম ও Public access পরীক্ষা করুন।"
            );

            file.countElement.textContent = "—";

        }

    }


    // মোট ফলাফল
    resultCount.textContent = `${total}টি ফলাফল`;


    // সার্চের অবস্থা
    if (loaded === 0) {

        statusBox.textContent =
            "⚠️ কোনো TXT ফাইল লোড হয়নি। GitHub-এর ফাইলের নাম ও Public access পরীক্ষা করুন।";

    } else if (total > 0) {

        statusBox.textContent =
            `✅ মোট ${total}টি ফলাফল পাওয়া গেছে — Male: ${maleMatches}, Female: ${femaleMatches}।`;

    } else {

        statusBox.textContent =
            "❌ কোনো তথ্য পাওয়া যায়নি।";

    }

});


let currentQuestionIndex = 0;
let questions = [];
let currentResponse = { answer: "", comments: "" };
let responses = [];




async function fetchQuestions() {
    const response = await fetch('/static/questions.json');
    questions = await response.json();
    updateQuestion();
}

function updateQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById("questionHeader").textContent = currentQuestion?.header;
    document.getElementById("questionText").textContent = currentQuestion?.text;

    // Hide "Previous" button on the first question
    document.getElementById("prevButton").style.display = currentQuestionIndex === 0 ? "none" : "block";

    // Change button text to "Submit" if it's the last question
    document.getElementById("nextButton").innerHTML = currentQuestionIndex === questions.length - 1 ? "<h6>Submit</h6>" : "<h6>Next</h6>";

    // Reset radio button selection
    const radioButtons = document.querySelectorAll('input[name="exampleRadios"]');
    radioButtons.forEach(button => {
        button.checked = false;
    });

    // Reset comments field
    document.getElementById("exampleFormControlInput1").value = "";

    // Populate form fields with current response data
    document.getElementById("exampleFormControlInput1").value = currentResponse.comments;
    if (currentResponse.answer === "Yes") {
        document.getElementById("exampleRadios1").checked = true;
    } else if (currentResponse.answer === "No") {
        document.getElementById("exampleRadios2").checked = true;
    }
}

function collectResponse() {
    const selectedOption = document.querySelector('input[name="exampleRadios"]:checked');
    const comments = document.getElementById("exampleFormControlInput1").value;
    currentResponse = { answer: selectedOption ? selectedOption.value : "", comments: comments };
}

document.getElementById("prevButton").addEventListener("click", function () {
    collectResponse();
    currentQuestionIndex--;
    if (currentQuestionIndex < 0) {
        currentQuestionIndex = 0;
    } else {
        currentResponse = responses[currentQuestionIndex] || { answer: "", comments: "" };
    }
    updateQuestion();
});

document.getElementById("nextButton").addEventListener("click", function () {
    collectResponse();
    responses[currentQuestionIndex] = { answer: currentResponse.answer, comments: currentResponse.comments };
    currentQuestionIndex++;
    if (currentQuestionIndex === questions.length) {
        fetch('http://localhost:5000/submitResponses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responses)
        })
        .then(response => {
            if (response.ok) {

                document.getElementById("questionContainer").style.display = 'none';
               
                showCustomAlert("Successfully Submitted!");

                document.getElementById("customAlertOK").addEventListener("click", function () {
                    closeCustomAlert();
                  
                });

                
            } else {
                // Display error message
                showCustomAlert('Successfully Submitted!');
                
            }
        })
        .catch(error => {
            // Display error message
            showCustomAlert('Successfully Submitted!');
            
        });
        return;
    }
    currentResponse = responses[currentQuestionIndex] || { answer: "", comments: "" };
    updateQuestion();
});

function displaySuccessAlert() {
    const alertSuccess = document.getElementById('alertSuccess');
    alertSuccess.style.display = 'block';
    setTimeout(() => {
        alertSuccess.style.display = 'none';
    }, 3000); // Hide the alert after 3 seconds
}


function showCustomAlert(message) {
    document.getElementById("alertMessage").textContent = message;
    document.getElementById("customAlert").style.display = "block";
}

function closeCustomAlert() {
    document.getElementById("customAlert").style.display = "none";
    document.getElementById("questionContainer").style.display = 'block';
      // Reset questionnaire state
      currentQuestionIndex = 0;
      responses = [];
      updateQuestion();
}


window.addEventListener('DOMContentLoaded', fetchQuestions);

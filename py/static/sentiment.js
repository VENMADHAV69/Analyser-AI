document.addEventListener("DOMContentLoaded", function() {
    // Function to populate dropdown
    function populateDropdown(questions) {
        questions.forEach(question => {
            const option = document.createElement('option');
            option.value = question.text;
            option.textContent = question.text;
            selectedQuestionDropdown.appendChild(option);
        });
    }

    // Function to update the output text
    function updateOutputText(newText) {
        const outputElement = document.getElementById('outputText');
        outputElement.textContent = newText;

        // Show the card once the output text is assigned
        document.getElementById('questionContainer').style.display = 'block';
    }

    // Fetch questions from JSON file
    fetch('/static/questions.json')
    .then(response => response.json())
    .then(data => {
        const selectedQuestionDropdown = document.getElementById('selectedQuestionDropdown');
  
        // Populate dropdown with all questions initially
        populateDropdown(data);
  
        // Set the first option as default selected
        selectedQuestionDropdown.selectedIndex = 0;
  
        const submitButton = document.getElementById('submitButton');
        submitButton.addEventListener('click', function() {
            const selectedQuestionText = selectedQuestionDropdown.value;
            if (selectedQuestionText === '') {
                alert('Please select a question.');
            } else {
                // Additional data to include along with the selected question
                const additionalData = {
                    // Add any extra fields you want to send
                    key: ''
                };
        
                // Combine the selected question and additional data into a single object
                const requestData = {
                    selectedQuestionText: selectedQuestionText + ' ' + additionalData.key,
                };
        
                fetch('/store_selected_question', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data); // Log the response from the server if needed
                    if (data.status === 'success') {
                        
                        updateOutputText(data.output_text);
                    } else {
                        alert('Failed to store selected question.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
        
    }); // Close fetch

}); // Close DOMContentLoaded function

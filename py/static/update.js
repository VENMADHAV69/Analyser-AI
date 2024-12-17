document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch questions from JSON file
    function fetchQuestions() {
        fetch('/static/questions.json')
            .then(response => response.json())
            .then(data => {
                // Clear existing questions before adding new ones
                const questionsList = document.getElementById('questionsList');
                questionsList.innerHTML = `
                    <thead>
                        <tr>
                            <th><strong>Question No</strong></th>
                            <th><strong>Questions</strong></th>
                            <th></th> <!-- Empty column for Remove button -->
                        </tr>
                    </thead>
                    <tbody></tbody>`;
                // Loop through the questions and create HTML elements for each
                data.forEach((question, index) => {
                    addQuestionRow(question, index);
                });
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });
    }

    // Function to add a new question row
    function addQuestionRow(question, index) {
        const questionsList = document.getElementById('questionsList').getElementsByTagName('tbody')[0];
        const newRow = questionsList.insertRow();
        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${question.text}</td>
            <td><button class="btn btn-danger removeButton">Remove</button></td>
        `;
        // Add event listener for remove button
        const removeButton = newRow.querySelector('.removeButton');
        removeButton.addEventListener('click', function() {
            // Remove the question from the list and update display
            removeQuestion(index);
        });
    }

    function removeQuestion(index) {
        fetch('/remove_question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index: index }) // Ensure index is sent correctly
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Remove the question row from the list
                const questionsList = document.getElementById('questionsList').getElementsByTagName('tbody')[0];
                questionsList.deleteRow(index);

                // Update index numbers of remaining questions in the frontend
                const remainingQuestions = questionsList.rows;
                for (let i = index; i < remainingQuestions.length; i++) {
                    remainingQuestions[i].cells[0].innerText = i + 1;
                }
            } else {
                alert('Failed to remove question.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to remove question.');
        });
    }

    const addQuestionButton = document.getElementById('addQuestionButton');
    addQuestionButton.addEventListener('click', function() {
        const newQuestionInput = document.getElementById('newQuestionInput');
        const newQuestion = newQuestionInput.value.trim();
        if (newQuestion !== '') {
            fetch('/add_question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: newQuestion })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // If the question is successfully added, fetch and display updated questions
                    fetchQuestions();
                    // Clear the input field after adding the question
                    newQuestionInput.value = '';
                } else {
                    alert('Failed to add question.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add question.');
            });
        } else {
            alert('Please enter a valid question.');
            
        }
    });

    // Call fetchQuestions function to load questions initially
    fetchQuestions();
});

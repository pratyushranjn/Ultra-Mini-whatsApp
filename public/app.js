// Add a confirmation prompt when clicking the delete button
const deleteButtons = document.querySelectorAll('.delete-btn');

deleteButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const isConfirmed = confirm('Are you sure you want to delete this chat?');
    if (!isConfirmed) {
      event.preventDefault(); // Stop the form from being submitted
    }
  });
});

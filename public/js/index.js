// document.getElementById("addTaskbtn").addEventListener("click",function() {
//     console.log("click");
//     const taskName = document.getElementById("taskName").value.trim(  );
//     const descrp = document.getElementById("taskDescription").value.trim();
//     const dt = document.getElementById("taskDeadline").value;
//     const tableRef = document.getElementById("taskTable").getElementsByTagName("tbody")[0];

//     console.log(taskName);
//     if(taskName!=='' && dt!==''){
//         var newRow = tableRef.insertRow(tableRef.rows.length);
//         newRow.innerHTML = `<tr><td>${taskName}</td><td>${dt}</td><td><button class="delete-btn">Delete</button><button class="edit-btn">Edit</button></td></tr>`;
        
//         // let h = document.createElement("li");
//         // h.innerHTML = `${taskName}<small>${dt}</small> <button class="delete-btn">Delete</button>`;
//         // taskList.appendChild(h);

//         document.getElementById("taskName").value = "";
//         document.getElementById("taskDescription").value = "";
//         document.getElementById("taskDeadline").value="";

//         newRow.querySelector('.delete-btn').addEventListener('click', function() {
//             // taskList.removeChild(h);
//             document.getElementById("taskTable").deleteRow(newRow.rowIndex);
//         });

//         newRow.querySelector('.edit-btn').addEventListener('click',function() {
//             //disable every other activity while editing one
//             newRow.innerHTML = `<tr><td><input type="text" id="tname" name="tname" value="${taskName}"></td><td><input type="date" id="tdate" name="tdate" value="${dt}"></td><td><button class="delete-btn">Delete</button><button class="save-btn">Save</button></td></tr>`;
//             document.getElementById("addTaskbtn").disabled = true;
//             document.getElementsByClassName("delete-btn edit-btn").disabled = true;

//             newRow.querySelector('.save-btn').addEventListener('click', function() {
//                 let tname = document.getElementById("tname").value;
//                 let tdate = document.getElementById("tdate").value;
    
//                 newRow.innerHTML = `<tr><td>${tname}</td><td>${tdate}</td><td><button class="delete-btn">Delete</button><button class="edit-btn">Edit</button></td></tr>`;
//             });

//             document.getElementById("addTaskbtn").disabled = false;
//             document.getElementsByClassName("delete-btn edit-btn").disabled = false;
//         });

//         // newRow.querySelector('.save-btn').addEventListener('click', function() {
//         //     let tname = document.getElementById("tname").value;
//         //     let tdate = document.getElementById("tdate").value;

//         //     document.getElementById("addTaskbtn").disabled = false;
//         //     document.getElementsByClassName("delete-btn edit-btn").disabled = false;
//         //     newRow.innerHTML = `<tr><td>${tname}</td><td>${tdate}</td><td><button class="delete-btn">Delete</button><button class="edit-btn">Edit</button></td></tr>`;
//         // });
//     }
// });
document.addEventListener("DOMContentLoaded", function() {
    const dropBtn = document.getElementById('drop-btn');
    const taskDescription = document.getElementById('taskDescription');
    
    dropBtn.addEventListener('click', function() {
        if (taskDescription.classList.contains('show')) {
            taskDescription.classList.remove('show');
            setTimeout(() => {
                taskDescription.style.display = "none";
            }, 500); // Wait for the transition to finish before setting display to none
        } else {
            taskDescription.style.display = "block";
            setTimeout(() => {
                taskDescription.classList.add('show');
            }, 10); // Small delay to trigger the transition
        }
    });
});

document.getElementById("addTaskbtn").addEventListener("click", function() {
    console.log("click");
    const taskName = document.getElementById("taskName").value.trim();
    const dt = document.getElementById("taskDeadline").value;
    const tableRef = document.getElementById("taskTable").getElementsByTagName("tbody")[0];

    console.log(taskName);
    if (taskName !== '' && dt !== '') {
        var newRow = tableRef.insertRow(tableRef.rows.length);
        newRow.innerHTML = `<td>${taskName}</td><td>${dt}</td><td><button class="delete-btn">Delete</button><button class="edit-btn">Edit</button></td>`;

        addEventListeners(newRow);

        // Clear the input fields
        document.getElementById("taskName").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDeadline").value = "";
    }
});

function addEventListeners(row) {
    row.querySelector('.delete-btn').addEventListener('click', function() {
        document.getElementById("taskTable").deleteRow(row.rowIndex);
    });

    row.querySelector('.edit-btn').addEventListener('click', function() {
        // Save the original task name and date
        let taskName = row.querySelector('td:nth-child(1)').textContent;
        let dt = row.querySelector('td:nth-child(2)').textContent;

        // Replace row content with input fields and save/delete buttons
        row.innerHTML = `
            <td><input type="text" id="tname" name="tname" value="${taskName}"></td>
            <td><input type="date" id="tdate" name="tdate" value="${dt}"></td>
            <td><button class="delete-btn">Delete</button><button class="save-btn">Save</button></td>
        `;

        // Disable add task button and other delete/edit buttons
        document.getElementById("addTaskbtn").disabled = true;
        let buttons = document.querySelectorAll('.delete-btn, .edit-btn');
        buttons.forEach(button => button.disabled = true);

        row.querySelector('.save-btn').addEventListener('click', function() {
            let tname = document.getElementById("tname").value;
            let tdate = document.getElementById("tdate").value;

            // Restore row content with the updated values and re-add buttons
            row.innerHTML = `
                <td>${tname}</td>
                <td>${tdate}</td>
                <td><button class="delete-btn">Delete</button><button class="edit-btn">Edit</button></td>
            `;

            // Re-enable add task button and other buttons
            document.getElementById("addTaskbtn").disabled = false;
            buttons = document.querySelectorAll('.delete-btn, .edit-btn');
            buttons.forEach(button => button.disabled = false);

            // Re-attach event listeners to the new buttons
            addEventListeners(row);
        });

        row.querySelector('.delete-btn').addEventListener('click', function() {
            row.remove();
            document.getElementById("addTaskbtn").disabled = false;
            buttons = document.querySelectorAll('.delete-btn, .edit-btn');
            buttons.forEach(button => button.disabled = false);
        });
    });
}

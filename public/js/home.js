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
            }, 500);
        } else {
            taskDescription.style.display = "block";
            setTimeout(() => {
                taskDescription.classList.add('show');
            }, 10);
        }
    });

    document.getElementById("addTaskbtn").addEventListener("click", function() {
        const taskName = document.getElementById("taskName").value.trim();
        const taskDescription = document.getElementById("taskDescription").value.trim();
        const dt = document.getElementById("taskDeadline").value;
        const taskList = document.getElementById("taskList").value;
        const tableRef = document.getElementById("taskTable").getElementsByTagName("tbody")[0];

        if (taskName !== '' && dt !== '') {
            const newRow = tableRef.insertRow(tableRef.rows.length);
            newRow.className = "task-row incomplete";
            newRow.dataset.list = taskList;
            newRow.innerHTML = `<td>${taskName}</td><td>${dt}</td><td>${taskList}</td><td><button class="delete-btn">Delete</button><button class="edit-btn">Edit</button><button class="comp-btn">Completed</button></td>`;

            addEventListeners(newRow);

            // Clear the input fields
            document.getElementById("taskName").value = "";
            document.getElementById("taskDescription").value = "";
            document.getElementById("taskDeadline").value = "";
            document.getElementById("taskList").value = "None";
        }
    });

    function addEventListeners(row) {
        row.querySelector('.delete-btn').addEventListener('click', function() {
            document.getElementById("taskTable").deleteRow(row.rowIndex);
        });

        row.querySelector('.edit-btn').addEventListener('click', function() {
            let taskName = row.querySelector('td:nth-child(1)').textContent;
            let dt = row.querySelector('td:nth-child(2)').textContent;
            let taskList = row.querySelector('td:nth-child(3)').textContent;

            row.innerHTML = `
                <td><input type="text" id="tname" name="tname" value="${taskName}"></td>
                <td><input type="date" id="tdate" name="tdate" value="${dt}"></td>
                <td>${taskList}</td>
                <td><button class="save-btn">Save</button></td>
            `;

            document.getElementById("addTaskbtn").disabled = true;
            let buttons = document.querySelectorAll('.delete-btn, .edit-btn');
            buttons.forEach(button => button.disabled = true);

            row.querySelector('.save-btn').addEventListener('click', function() {
                let tname = document.getElementById("tname").value;
                let tdate = document.getElementById("tdate").value;

                row.innerHTML = `
                    <td>${tname}</td>
                    <td>${tdate}</td>
                    <td>${taskList}</td>
                    <td><button class="delete-btn">Delete</button><button class="edit-btn">Edit</button><button class="comp-btn">Completed</button></td>
                `;

                document.getElementById("addTaskbtn").disabled = false;
                buttons = document.querySelectorAll('.delete-btn, .edit-btn');
                buttons.forEach(button => button.disabled = false);

                addEventListeners(row);
            });

            row.querySelector('.delete-btn').addEventListener('click', function() {
                row.remove();
                document.getElementById("addTaskbtn").disabled = false;
                buttons = document.querySelectorAll('.delete-btn, .edit-btn');
                buttons.forEach(button => button.disabled = false);
            });
        });

        row.querySelector('.comp-btn').addEventListener('click', function() {
            row.classList.toggle('completed');
            row.classList.toggle('incomplete');
        });
    }

    document.getElementById("allTasksBtn").addEventListener("click", function() {
        filterTasks("all");
    });

    document.getElementById("completedTasksBtn").addEventListener("click", function() {
        filterTasks("completed");
    });

    document.getElementById("incompleteTasksBtn").addEventListener("click", function() {
        filterTasks("incomplete");
    });

    function filterTasks(filter) {
        const rows = document.querySelectorAll("#taskTable tbody tr");
        rows.forEach(row => {
            if (filter === "all") {
                row.style.display = "";
            } else if (filter === "completed" && row.classList.contains('completed')) {
                row.style.display = "";
            } else if (filter === "incomplete" && row.classList.contains('incomplete')) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }
});


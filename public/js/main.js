const deleteBtn = document.querySelectorAll(".del");
const deleteAllBtn = document.getElementById("deleteAll");
const activityItem = document.querySelectorAll("span.activity");

Array.from(deleteBtn).forEach((el) => {
  el.addEventListener("click", deleteActivity);
});

deleteAllBtn.addEventListener("click", deleteAllActivities);

async function deleteActivity() {
  const activityId = this.parentNode.dataset.id;
  try {
    const response = await fetch("tracker/deleteActivity", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        activityIdFromJSFile: activityId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}

async function deleteAllActivities() {
  try {
    const activityElements = document.querySelectorAll(".activity-item");
    const activityIDs = Array.from(activityElements).map(
      (item) => item.dataset.id
    );
    const response = await fetch("tracker/deleteAll", {
      method: "delete",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        activityIDsFromJSFile: activityIDs,
      }),
    });

    if (response.status === 200) {
      console.log("All activites deleted");
      location.reload();
    } else {
      console.log("Failed to delete all activities");
    }
  } catch (err) {
    console.log(err);
  }
}
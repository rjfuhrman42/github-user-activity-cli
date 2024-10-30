const { error } = require("node:console");

(async function () {
  try {
    const username = process.argv[2];
    const userActivity = await fetchUserEvents(username);
    if (!userActivity || userActivity.length === 0) {
      console.log("No recent user activity found");
      process.exit(0);
    }
    userActivity.forEach((event) => {
      switch (event.type) {
        case "PushEvent":
          const numberOfCommits = event.payload.commits.length;
          console.log(
            `+ Pushed ${numberOfCommits} commits to ${event.repo.name}`
          );
          break;
        case "PullRequestEvent":
          console.log(`✍️  Opened a pull request in ${event.repo.name}`);
          break;
        case "IssuesEvent":
          console.log(`❌ Created a new issue in ${event.repo.name}`);
          // Expected output: "Mangoes and papayas are $2.79 a pound."
          break;
        case "CreateEvent":
          console.log(
            `🌱 Created a new ${event.payload.ref_type} ${event.payload.ref} in ${event.repo.name}`
          );
          break;
        case "DeleteEvent":
          console.log(
            `🗑️ Deleted  ${event.payload.ref_type} ${event.payload.ref} in ${event.repo.name}`
          );
          break;
        case "IssueCommentEvent":
          console.log(`- Commented on an issue in ${event.repo.name}`);
          break;
        case "WatchEvent":
          console.log(`⭐ Starred a repo: ${event.repo.name}`);
          break;
        case "ForkEvent":
          console.log(
            `🍴 Forked ${event.repo.name} into ${event.payload.forkee.full_name}`
          );
          break;
        default:
          break;
      }
    });
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
})();

async function fetchUserEvents(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/events`
  );
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Username ${username} was not found!`);
    } else {
      throw new Error(`${error.message}`);
    }
  } else {
    const userActivity = await response.json();
    if (!userActivity || userActivity.length === 0) {
      console.log("No recent user activity found");
      process.exit(0);
    }

    return userActivity;
  }
}

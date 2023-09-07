import fs from "fs";
const ERRORS_FILE = "src/error.log";
const EMAIL_NOTIFIFICATIONS_FILE = "src/notification-error.log";
const ERRORS_NOTIFICATION_THRESHOLD_IN_MILLISECONDS = 60 * 1000;
const ERRORS_TO_CHECK = 10;
const EMAILS_TIME_BETWEEN_IN_MILLISECONDS = 60 * 1000;
const EMAIL_ADDRESS = "reports@rsoftware.com";

export const home = async (req: any, res: any) => {
  const response = {};
  let count = 0;
  while (count <= 100) {
    try {
      throw new Error(`Error number ${count} in home`);
    } catch (error) {
      if (error instanceof Error) {
        logError(error);
      }
    }
    await waitForTesting(1000);
    count++;
  }
  res.status(200).json(response);
};

const waitForTesting = (milliseconds: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

const logError = (error: Error) => {
  try {
    const now = new Date();
    const log = `${now.toISOString()} - CODE: ${error.name} - ${
      error.message
    }\n`;
    fs.appendFileSync(ERRORS_FILE, log);
    checkRecentErrors(now);
    console.log(ERRORS_FILE, log);
    return log;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const checkRecentErrors = (now: Date) => {
  const logs = fs
    .readFileSync(ERRORS_FILE)
    .toString()
    .trim()
    .split("\n")
    .slice(-ERRORS_TO_CHECK);
  if (logs.length === ERRORS_TO_CHECK) {
    const [firstLog] = logs;
    const dateLog = getDateLog(firstLog);
    const differenceInMilliseconds = now.getTime() - dateLog.getTime();
    if (
      differenceInMilliseconds < ERRORS_NOTIFICATION_THRESHOLD_IN_MILLISECONDS
    ) {
      sendEmailNotificationIfNecesary();
    }
  }
};

const getDateLog = (log: string): Date => {
  const [date] = log.split(" ");
  return new Date(date);
};

const sendEmailNotificationIfNecesary = () => {
  const now = new Date();
  if (!fs.existsSync(EMAIL_NOTIFIFICATIONS_FILE)) {
    sendEmailNotification(now);
    return;
  }
  const emailLogs = fs
    .readFileSync(EMAIL_NOTIFIFICATIONS_FILE)
    .toString()
    .trim()
    .split("\n")
    .slice(-1);
  if (emailLogs.length === 0) {
    sendEmailNotification(now);
    return;
  }
  const [lastEmailLog] = emailLogs;
  const dateLog = getDateLog(lastEmailLog);
  const differenceInMilliseconds = now.getTime() - dateLog.getTime();
  if (differenceInMilliseconds > EMAILS_TIME_BETWEEN_IN_MILLISECONDS) {
    sendEmailNotification(now);
  }
};

const sendEmailNotification = (now: Date) => {
  const log = `${now.toISOString()} - Error reported to ${EMAIL_ADDRESS}.\n`;
  fs.appendFileSync(EMAIL_NOTIFIFICATIONS_FILE, log);
};

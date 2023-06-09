import express, { Application } from "express";
import {wrapInError, wrapInResponse} from "./utils/response";
import {GetGradesRequest, GetGroupsRequest, GetSchedulesRequest} from "./types/request";
import {getGroups} from "./api/getGroups";
import {getSchedules} from "./api/getSchedules";
import {getRaspisanFormattedDate} from "./utils/date";
import {convertLessonDaysToiCalendarEvents} from "./calendar/getCalendar";
import {getGrades} from "./api/getGrades";

const app: Application = express();

app.get('/ping', async (req, res) => {
  res
    .type('json')
    .send(wrapInResponse('pong'));
})

app.get('/grades', async (req: GetGradesRequest, res) => {
  const { query } = req;

  res.send(
    await getGrades(query)
  );
});

app.get('/groups', async (req: GetGroupsRequest, res) => {
  const { query } = req;

  res.send(
    await getGroups(query)
  );
});

app.get('/schedules', async (req: GetSchedulesRequest, res) => {
  const { query } = req;

  res.send(
    await getSchedules(query)
  );
});

app.get('/calendar', async (req: GetSchedulesRequest, res) => {
  try {
    if (!req.query.group) {
      return res.status(400).send(wrapInError('no_group_param'))
    }

    const data = await getSchedules({
      group: req.query.group,
      dateStart: getRaspisanFormattedDate(new Date(new Date().getFullYear(), 0, 1)),
      dateEnd: getRaspisanFormattedDate(new Date(new Date().getFullYear(), 11, 31)),
    });
    
    if (data && 'response' in data) {
      const calendar = await convertLessonDaysToiCalendarEvents(data.response);
      return res
        .type('text/calendar')
        .send(calendar);
    }
    
    res
      .status(500)
      .send(wrapInError('unknown_error'))
  } catch (e) {
    console.log(e);
    res.status(500);
  }
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
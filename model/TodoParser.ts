import { DateParser } from '../util/DateParser';
import { TodoItem, TodoItemStatus } from '../model/TodoItem';
import { DateTime } from 'luxon';
import { extractDueDateFromDailyNotesFile } from '../util/DailyNoteParser';

export class TodoParser {
  private dateParser: DateParser;
  private globalDateParser: DateParser;
  private globalDuoDate: DateTime;

  constructor(dateParser: DateParser, globalDateParser: DateParser) {
    this.dateParser = dateParser;
    this.globalDateParser = globalDateParser;
  }

  async parseTasks(filePath: string, fileContents: string): Promise<TodoItem[]> {
    this.globalDuoDate = this.globalDateParser.parseDate(fileContents);

    const pattern = /(-|\*) \[(\s|x)?\]\s(.*)/g;
    return [...fileContents.matchAll(pattern)].map((task) => this.parseTask(filePath, task));
  }

  private parseTask(filePath: string, entry: RegExpMatchArray): TodoItem {
    const todoItemOffset = 2; // Strip off `-|* `
    const status = entry[2] === 'x' ? TodoItemStatus.Done : TodoItemStatus.Todo;
    const description = entry[3];

    const actionDate = this.parseDueDate(description, filePath);
    const descriptionWithoutDate = this.dateParser.removeDate(description);
    const somedayPattern = /#(someday)/g;
    const isSomedayMaybeTask = description.match(somedayPattern) != null;

    return new TodoItem(
      status,
      descriptionWithoutDate,
      isSomedayMaybeTask,
      filePath,
      (entry.index ?? 0) + todoItemOffset,
      entry[0].length - todoItemOffset,
      !isSomedayMaybeTask ? (actionDate ? actionDate : this.globalDuoDate) : undefined,
    );
  }

  private parseDueDate(description: string, filePath: string): DateTime | undefined {
    const taggedDueDate = this.dateParser.parseDate(description);
    if (taggedDueDate) {
      return taggedDueDate;
    }
    return extractDueDateFromDailyNotesFile(filePath);
  }
}

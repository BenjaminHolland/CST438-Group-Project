export interface Message {
  data: string;
  time: string | null;
  username: string;
}

export class MessageModel implements Message {
  public constructor(
    public data: string,
    public username: string,
    public time: string | null = null,
  ) {

  }

}

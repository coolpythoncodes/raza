type Props = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  total?: number;
  suffix?: string;
  completed?: boolean;
};

export const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: Props) => {
  if (completed) {
    return <span>Time is up!</span>;
  } else {
    return (
      <span>
        {days ? `${days} days ` : null}
        {hours ? `${hours} hrs ` : null}
        {minutes ? `${minutes} mins ` : null}
        {seconds ? `${seconds} secs ` : null}
      </span>
    );
  }
};

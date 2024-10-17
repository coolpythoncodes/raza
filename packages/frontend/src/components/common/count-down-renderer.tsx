// @ts-expect-error unknown error
export const renderer = ({ days, hours, minutes, completed }: unknown) => {
  if (completed) {
    return <span>Time is up!</span>;
  } else {
    return (
      <span>
        {days ? `${days} days ` : null}
        {hours ? `${hours} hrs ` : null}
        {minutes ? `${minutes} mins ` : null}
      </span>
    );
  }
};

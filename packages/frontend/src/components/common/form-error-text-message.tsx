import { type FieldError } from "react-hook-form";

type Props = {
  errors: FieldError | undefined;
};

const FormErrorTextMessage = ({ errors }: Props) => {
  return (
    <>
      {errors ? (
        <p className="font-montserrat mt-[6px] text-sm font-normal text-red-500">
          {errors.message}
        </p>
      ) : null}
    </>
  );
};

export default FormErrorTextMessage;

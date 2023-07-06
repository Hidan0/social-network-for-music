import { JSX, splitProps } from "solid-js";

type TextInputProps = {
  name: string;
  type: "text" | "email" | "tel" | "password" | "url" | "date";
  label?: string;
  placeholder?: string;
  value: string | undefined;
  error: string;
  required?: boolean;
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

export function InputControl(props: TextInputProps) {
  const [, inputProps] = splitProps(props, ["value", "label", "error"]);

  return (
    <div class="mb-3">
      {props.label && (
        <label class="form-label" for={props.name}>
          {props.label}
        </label>
      )}
      <input
        class={`form-control ${!!props.error ? "is-invalid" : ""}`}
        {...inputProps}
        id={props.name}
        value={props.value || ""}
        aria-invalid={!!props.error}
      />
      {props.error && (
        <div
          class={`${!!props.error ? "in" : ""}valid-feedback`}
          id={`${props.name}-error`}
        >
          {props.error}
        </div>
      )}
    </div>
  );
}

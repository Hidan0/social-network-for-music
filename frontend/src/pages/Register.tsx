import { Component } from "solid-js";
import { Container, Button, Row, Col } from "solid-bootstrap";
import { z } from "zod";
import { createForm, zodForm, SubmitHandler } from "@modular-forms/solid";
import { InputControl } from "../components/auth/InputControl";
import { A } from "@solidjs/router";
import { registerSchema } from "../utils/validations_schema";

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterScreen: Component = () => {
  const [, { Form: ZForm, Field }] = createForm<RegisterForm>({
    validate: zodForm(registerSchema),
  });

  const handleSubmit: SubmitHandler<RegisterForm> = (values, _event) => {
    console.log(values);
  };

  return (
    <Container class="text-center mt-4">
      <Row>
        <Col>
          <h1 class="text-primary">Register</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            <span class="text-primary">Sign up</span> to unlock all features.
          </p>
        </Col>
      </Row>
      <Row class="justify-content-center">
        <Col lg="6" md="8">
          <ZForm onSubmit={handleSubmit} class="needs-validation">
            <Field name="email">
              {(field, props) => (
                <InputControl
                  {...props}
                  type="email"
                  label="Email Address"
                  value={field.value}
                  error={field.error}
                  placeholder="local-name@domain"
                  required
                />
              )}
            </Field>
            <Field name="username">
              {(field, props) => (
                <InputControl
                  {...props}
                  type="text"
                  label="Username"
                  value={field.value}
                  error={field.error}
                  placeholder="Username"
                  required
                />
              )}
            </Field>
            <Field name="name">
              {(field, props) => (
                <InputControl
                  {...props}
                  type="text"
                  label="Name"
                  value={field.value}
                  error={field.error}
                  placeholder="Name"
                  required
                />
              )}
            </Field>
            <Field name="password">
              {(field, props) => (
                <InputControl
                  {...props}
                  type="password"
                  label="Password"
                  value={field.value}
                  error={field.error}
                  placeholder="Password"
                  required
                />
              )}
            </Field>
            <Field name="confirmPassword">
              {(field, props) => (
                <InputControl
                  {...props}
                  type="password"
                  label="Confirm Password"
                  value={field.value}
                  error={field.error}
                  placeholder="Confirm password"
                  required
                />
              )}
            </Field>
            <div class="d-grid mt-5">
              <Button variant="primary" type="submit">
                Register
              </Button>
            </div>
          </ZForm>
        </Col>
      </Row>
      <Row>
        <p class="text-secondary mt-2">
          Already have and account?{" "}
          <A class="fw-bold" href="/login">
            Login
          </A>
        </p>
      </Row>
    </Container>
  );
};

export default RegisterScreen;

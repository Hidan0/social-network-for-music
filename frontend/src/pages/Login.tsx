import { Component } from "solid-js";
import { Container, Button, Row, Col } from "solid-bootstrap";
import { z } from "zod";
import { createForm, zodForm, SubmitHandler } from "@modular-forms/solid";
import { InputControl } from "../components/auth/InputControl";
import { loginSchema } from "../utils/validations_schema";
import { A } from "@solidjs/router";

type LoginForm = z.infer<typeof loginSchema>;

const LoginScreen: Component = () => {
  const [, { Form: ZForm, Field }] = createForm<LoginForm>({
    validate: zodForm(loginSchema),
  });

  const handleSubmit: SubmitHandler<LoginForm> = (values, _event) => {
    console.log(values);
  };

  return (
    <Container class="text-center mt-4">
      <Row>
        <Col>
          <h1 class="text-primary">Log in</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>
            Access your <span class="text-primary">account</span> to unlock all
            features.
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

            <div class="d-grid mt-5">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </div>
          </ZForm>
        </Col>
      </Row>
      <Row>
        <p class="text-secondary mt-2">
          Don't have an account?{" "}
          <A class="fw-bold" href="/register">
            Register
          </A>
        </p>
      </Row>
    </Container>
  );
};

export default LoginScreen;

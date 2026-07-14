import { ApiError } from "@shared/api";
import { AppButton, AppLogo, IconButton, Screen, TextField } from "@shared/components";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform } from "react-native";
import { useLoginMutation } from "../hooks/useLoginMutation";
import type { LoginForm } from "../types/LoginForm";
import { validateLogin, type LoginErrors } from "../utils/loginValidation";
import {
  BottomActions,
  BrandBlock,
  Form,
  HelpButton,
  HelpText,
  KeyboardContent,
  LoginContent,
  LoginScroll,
  ScreenTitle,
  ServerErrorText,
  Spacer,
  Subtitle,
} from "./styles/LoginScreen.styled";

const initialForm: LoginForm = { 
  cpf: "12345678901",
  password: "password123",
};

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const canSubmit = useMemo(
    () => form.cpf.length === 11 && Boolean(form.password.trim()),
    [form],
  );

  async function submit() {
    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      await loginMutation.mutateAsync(form);
      router.replace("/main/home");
    } catch {
      // The mutation error is rendered below the fields.
    }
  }

  const serverError =
    loginMutation.error instanceof ApiError
      ? loginMutation.error.message
      : loginMutation.isError
        ? "Não foi possível entrar. Tente novamente."
        : undefined;

  return (
    <Screen>
      <KeyboardContent behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <LoginScroll
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <LoginContent>
            <BrandBlock>
              <AppLogo size={52} />
              <ScreenTitle>Entrar</ScreenTitle>
              <Subtitle>Acesse com seus dados institucionais</Subtitle>
            </BrandBlock>

            <Form>
              <TextField
                accessibilityLabel="CPF"
                autoCapitalize="none"
                errorText={errors.cpf}
                keyboardType="number-pad"
                label="CPF"
                maxLength={11}
                onChangeText={(text) => {
                  setForm((current) => ({ ...current, cpf: text.replace(/\D/g, "") }));
                  setErrors((current) => ({ ...current, cpf: undefined }));
                  loginMutation.reset();
                }}
                placeholder="Somente números (11 dígitos)"
                value={form.cpf}
              />
              <TextField
                accessibilityLabel="Senha institucional FUMP"
                errorText={errors.password}
                helpText="Use a mesma senha do Portal do Aluno / Colaborador."
                label="Senha"
                onChangeText={(password) => {
                  setForm((current) => ({ ...current, password }));
                  setErrors((current) => ({ ...current, password: undefined }));
                  loginMutation.reset();
                }}
                onSubmitEditing={submit}
                placeholder="Senha institucional FUMP"
                returnKeyType="done"
                secureTextEntry={!passwordVisible}
                trailing={
                  <IconButton
                    accessibilityLabel={passwordVisible ? "Ocultar senha" : "Mostrar senha"}
                    iconColor="textMuted"
                    iconSize={20}
                    name={passwordVisible ? "eye.slash" : "eye"}
                    onPress={() => setPasswordVisible((value) => !value)}
                    size={44}
                  />
                }
                value={form.password}
              />
              {serverError ? (
                <ServerErrorText accessibilityLiveRegion="polite">
                  {serverError}
                </ServerErrorText>
              ) : null}
            </Form>

            <Spacer />
            <BottomActions>
              <AppButton
                disabled={!canSubmit}
                label="Entrar"
                loading={loginMutation.isPending}
                onPress={submit}
              />
              <HelpButton
                accessibilityLabel="Precisa de ajuda?"
                accessibilityRole="button"
                onPress={() => router.push("/about")}
              >
                <HelpText>Precisa de ajuda?</HelpText>
              </HelpButton>
            </BottomActions>
          </LoginContent>
        </LoginScroll>
      </KeyboardContent>
    </Screen>
  );
}

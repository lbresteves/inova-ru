import { getApiErrorMessage } from "@shared/api";
import { Logo } from "@shared/components";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { useSessionStore } from "../store/sessionStore";
import type { LoginForm } from "../types/LoginForm";
import {
  type LoginErrors,
  validateLogin,
} from "../utils/loginValidation";
import { LoginButton } from "./components/LoginButton";
import { LoginField } from "./components/LoginField";
import {
  BrandBlock,
  Form,
  KeyboardContent,
  LoginContent,
  LoginScroll,
  Screen,
  ScreenTitle,
  ServerErrorText,
  Spacer,
  Subtitle,
} from "./styles/LoginScreen.styled";

const INITIAL_FORM: LoginForm = {
  institutionalId: "",
  password: "",
};

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const anonymousReason = useSessionStore((state) => state.anonymousReason);
  const clearAnonymousReason = useSessionStore((state) => state.clearAnonymousReason);

  const canSubmit = Boolean(
    form.institutionalId.trim() && form.password.trim(),
  );

  async function submit() {
    if (loginMutation.isPending) {
      return;
    }

    const nextErrors = validateLogin(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await loginMutation.mutateAsync(form);
      setForm(INITIAL_FORM);
      router.dismissTo("/main/home");
    } catch {
      // The mutation error is rendered below the fields.
    }
  }

  const sessionMessage = anonymousReason === "expired"
    ? "Sua sessão expirou. Entre novamente."
    : anonymousReason === "storage-error"
      ? "Não foi possível restaurar sua sessão."
      : undefined;

  const serverError = loginMutation.isError
    ? getApiErrorMessage(loginMutation.error)
    : sessionMessage;

  return (
    <Screen>
      <KeyboardContent behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <LoginScroll
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <LoginContent>
            <BrandBlock>
              <Logo size={52} style={{ marginHorizontal: 0 }} />
              <ScreenTitle>Entrar</ScreenTitle>
              <Subtitle>Acesse com CPF e senha institucional</Subtitle>
            </BrandBlock>

            <Form>
              <LoginField
                autoCapitalize="none"
                errorText={errors.institutionalId}
                keyboardType="number-pad"
                label="CPF"
                onChangeText={(institutionalId) => {
                  setForm((current) => ({
                    ...current,
                    institutionalId: institutionalId.replace(/\D/g, ""),
                  }));
                  setErrors((current) => ({
                    ...current,
                    institutionalId: undefined,
                  }));
                  loginMutation.reset();
                  clearAnonymousReason();
                }}
                placeholder="Somente números"
                value={form.institutionalId}
              />
              <LoginField
                errorText={errors.password}
                label="Senha"
                onChangeText={(password) => {
                  setForm((current) => ({ ...current, password }));
                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));
                  loginMutation.reset();
                  clearAnonymousReason();
                }}
                onSubmitEditing={() => void submit()}
                onToggleVisibility={() =>
                  setPasswordVisible((current) => !current)
                }
                passwordVisible={passwordVisible}
                placeholder="Senha institucional"
                returnKeyType="done"
                secureTextEntry={!passwordVisible}
                value={form.password}
              />
              {serverError ? (
                <ServerErrorText accessibilityLiveRegion="polite">
                  {serverError}
                </ServerErrorText>
              ) : null}
            </Form>

            <Spacer />
            <LoginButton
              disabled={!canSubmit || loginMutation.isPending}
              loading={loginMutation.isPending}
              onPress={() => void submit()}
            />
          </LoginContent>
        </LoginScroll>
      </KeyboardContent>
    </Screen>
  );
}

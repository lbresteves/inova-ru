import { ApiError } from "@shared/api/ApiError";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Platform } from "react-native";
import { useLoginMutation } from "../hooks/useLoginMutation";
import type { LoginForm } from "../types/LoginForm";
import {
  type LoginErrors,
  validateLogin,
} from "../utils/loginValidation";
import { LoginButton } from "./components/LoginButton";
import { LoginField } from "./components/LoginField";
import { RuMark } from "./components/RuMark";
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

const initialForm: LoginForm = {
  institutionalId: "",
  password: "",
};

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const canSubmit = useMemo(
    () => Boolean(form.institutionalId.trim() && form.password.trim()),
    [form],
  );

  async function submit() {
    const nextErrors = validateLogin(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await loginMutation.mutateAsync(form);
      setForm((current) => ({ ...current, password: "" }));
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
              <RuMark size={52} />
              <ScreenTitle>Entrar</ScreenTitle>
              <Subtitle>Acesse com seus dados institucionais</Subtitle>
            </BrandBlock>

            <Form>
              <LoginField
                autoCapitalize="none"
                errorText={errors.institutionalId}
                keyboardType="number-pad"
                label="Usuário institucional"
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
                }}
                placeholder="Número de usuário"
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
              disabled={!canSubmit}
              loading={loginMutation.isPending}
              onPress={() => void submit()}
            />
          </LoginContent>
        </LoginScroll>
      </KeyboardContent>
    </Screen>
  );
}

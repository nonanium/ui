"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent,
  type PointerEvent,
  type SyntheticEvent,
} from "react";
import { useNonaniumSettings } from "./settings";
import { playSound, type InteractionSound } from "./lib/sound";

export type { InteractionSound } from "./lib/sound";

// Override volume multiplies the global volume, so the global level remains a ceiling.
export type SoundOverride = boolean | { enabled?: boolean; volume?: number };
export type SoundComponent =
  | "button"
  | "toggle"
  | "switch"
  | "slider"
  | "drag"
  | "select"
  | "tabs"
  | "typing";

export type SoundConfig = {
  enabled?: boolean;
  typingEnabled?: boolean;
  // Typing level relative to the global volume. Defaults to 0.35.
  typingVolume?: number;
  // Volume is clamped to 0..1. Defaults to 0.25.
  volume?: number;
  components?: Partial<Record<SoundComponent, SoundOverride>>;
};

export type SoundProps = { sound?: SoundOverride };

// Global enablement is a master mute. Overrides cannot turn it back on.
export function useInteractionSound(
  component: SoundComponent,
  override?: SoundOverride,
) {
  const { settings } = useNonaniumSettings();
  const config = settings.sounds;
  const configured = config?.components?.[component];
  const local =
    typeof override === "boolean" ? { enabled: override } : override;
  const shared =
    typeof configured === "boolean" ? { enabled: configured } : configured;
  const enabled =
    config?.enabled === true &&
    (component !== "typing" || config.typingEnabled === true) &&
    (local?.enabled ?? shared?.enabled ?? true);
  const multiplier = local?.volume ?? shared?.volume ?? 1;
  const volume =
    Math.min(1, Math.max(0, config?.volume ?? 0.25)) *
    (component === "typing"
      ? Math.min(1, Math.max(0, config?.typingVolume ?? 0.35))
      : 1) *
    Math.min(1, Math.max(0, multiplier));

  return useCallback(
    (voice: InteractionSound) => {
      if (enabled && Number.isFinite(volume)) void playSound(voice, volume);
    },
    [enabled, volume],
  );
}

// Actual edits cover mobile keyboards too. Pasting and password fields stay silent.
export function useTypingSound(override?: SoundOverride) {
  const play = useInteractionSound("typing", override);
  return useCallback(
    (event: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const input = event.currentTarget;
      const native = event.nativeEvent as InputEvent;
      if (
        event.defaultPrevented ||
        input.disabled ||
        input.readOnly ||
        input.type === "password" ||
        native.isComposing
      )
        return;
      if (
        [
          "insertText",
          "insertLineBreak",
          "insertParagraph",
          "deleteContentBackward",
          "deleteContentForward",
        ].includes(native.inputType)
      )
        play("typing");
    },
    [play],
  );
}

// Attach to a drag handle. Release outside the handle still snaps; cancellation stays silent.
export function useDragSound(
  component: SoundComponent = "drag",
  override?: SoundOverride,
) {
  const play = useInteractionSound(component, override);
  const currentPlay = useRef(play);
  const cleanup = useRef<(() => void) | undefined>(undefined);
  useEffect(() => {
    currentPlay.current = play;
  }, [play]);
  useEffect(() => () => cleanup.current?.(), []);

  return useCallback(
    (event: PointerEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        !event.isPrimary ||
        event.currentTarget.matches(
          ':disabled, [aria-disabled="true"], [data-disabled]',
        )
      )
        return;
      cleanup.current?.();
      play("press");
      const doc = event.currentTarget.ownerDocument;
      const pointerId = event.pointerId;
      const finish = (release: globalThis.PointerEvent) => {
        if (release.pointerId !== pointerId) return;
        cleanup.current?.();
        if (release.type === "pointerup") currentPlay.current("snap");
      };
      cleanup.current = () => {
        doc.removeEventListener("pointerup", finish, true);
        doc.removeEventListener("pointercancel", finish, true);
        doc.defaultView?.removeEventListener("blur", cancel);
        cleanup.current = undefined;
      };
      const cancel = () => cleanup.current?.();
      doc.addEventListener("pointerup", finish, true);
      doc.addEventListener("pointercancel", finish, true);
      doc.defaultView?.addEventListener("blur", cancel);
    },
    [play],
  );
}

export function useInteractionSoundHandlers(
  component: SoundComponent,
  override?: SoundOverride,
) {
  const onPointerDown = useDragSound(component, override);
  const play = useInteractionSound(component, override);
  return {
    onPointerDown,
    onKeyDown: (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.currentTarget.matches(
          ':disabled, [aria-disabled="true"], [data-disabled]',
        )
      )
        return;
      if (
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
          "PageUp",
          "PageDown",
        ].includes(event.key)
      )
        play("snap");
    },
  };
}

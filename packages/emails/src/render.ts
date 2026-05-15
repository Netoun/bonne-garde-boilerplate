import { render } from "@react-email/render";
import React from "react";
import type { EmailTemplateProps } from "./types";

export type EmailTemplate = (props: EmailTemplateProps) => React.ReactElement;

export async function renderEmailTemplate(
  template: EmailTemplate,
  props: EmailTemplateProps,
): Promise<string> {
  return render(React.createElement(template, props));
}

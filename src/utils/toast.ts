import { useToast } from "vue-toastification";
import { ToastOptions } from "vue-toastification/src/types/index";
import Toast from "../components/Toast.vue";

type ToastTypes = "info" | "success" | "warning" | "error";

type ToastInterface = {
  [type in ToastTypes]: (title: string, body: string) => void;
};

const useCustomToast = () => {
  const toast = useToast();

  const createMyToastMethod = <M extends ToastTypes>(
    method: M
  ): ToastInterface[M] => {
    return (title, body, options?: ToastOptions) =>
      toast[method]({ component: Toast, props: { title, body }, options });
  };

  const toastInterface: ToastInterface = {
    info: createMyToastMethod("info"),
    success: createMyToastMethod("success"),
    warning: createMyToastMethod("warning"),
    error: createMyToastMethod("error"),
  };
  return toastInterface;
};

export default useCustomToast;

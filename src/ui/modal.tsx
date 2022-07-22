import {
  ReactNode,
  ReactElement,
  createContext,
  useState,
  useContext,
  useCallback,
  useRef,
  FunctionComponent,
  useMemo,
} from 'react';
import { useClickOutside } from './interactions';

export interface ModalComponentProps {
  id?: string;
  dismissModal: () => void;
}

export type ModalComponent = FunctionComponent<ModalComponentProps>;

export type ModalType = 'full' | 'overlay';

export interface Modal {
  id: string;
  type?: ModalType;
  component?: ModalComponent;
  onDismiss?: () => unknown;
  isActive?: boolean;
}

export interface PushModalParams {
  component: ModalComponent;
  type?: ModalType;
  onDismiss?: () => unknown;
}

export type PushModalFunction = (params: PushModalParams) => string | undefined;

export interface ModalsState {
  modals: Modal[];
  pushModal: PushModalFunction;
  dismissModal: (id: string) => void;
}

const Context = createContext<ModalsState | undefined>(undefined);

export function useModals(): ModalsState {
  const modals = useContext<ModalsState | undefined>(Context);
  if (!modals) {
    throw new Error('useModals() should be used inside <ModalContext> component');
  }
  return modals;
}

export interface ModalContainerProps {
  id: string;
  modal: Modal;
  dismissModal: () => void;
}

function ModalContainer({ id, modal, dismissModal }: ModalContainerProps): ReactElement {
  const modalElement = useRef<HTMLDivElement>(null);

  const onClickOutside = useCallback(() => {
    if (modal.isActive) {
      dismissModal();
    }
  }, [dismissModal, modal.isActive]);

  useClickOutside(modalElement, onClickOutside);

  // Hack here: We need to delay the removal of the modal so the outside click doesn't get triggered.
  // 5ms seems to be a reasonable threshold.
  const delayedDismissModal = useCallback(() => {
    if (dismissModal) {
      setTimeout(dismissModal, 5);
    }
  }, [dismissModal]);

  return (
    <div className={`cezembre-fronts-modal ${modal.type || 'full'}`} id={id}>
      <div className="container">
        <div ref={modalElement}>
          {modal.component ? (
            <modal.component id={modal.id} dismissModal={delayedDismissModal} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export interface ContextProps {
  children?: ReactNode;
}

export function ModalsContext({ children }: ContextProps): ReactElement {
  const [modals, setModals] = useState<Modal[]>([]);

  const pushModal = useCallback(
    (params: PushModalParams) => {
      const modal: Modal = {
        ...params,
        id: Math.random().toString(36).substring(5),
        isActive: true,
      };

      setTimeout(() => {
        setModals((_modals: Modal[]) => [
          ..._modals.map((_modal) => ({ ..._modal, isActive: false })),
          modal,
        ]);
      }, 10);

      return modal.id;
    },
    [setModals],
  );

  const dismissModal = useCallback(
    (id: string) => {
      setModals((_modals) => {
        const nextModals = [..._modals];
        const index = nextModals.findIndex((modal) => modal.id === id);
        if (index !== -1) {
          const { onDismiss } = _modals[index];
          if (onDismiss) {
            onDismiss();
          }
          nextModals.splice(index, 1);
          if (nextModals.length) {
            nextModals[nextModals.length - 1].isActive = true;
          }
        }
        return nextModals;
      });
    },
    [setModals],
  );

  const value = useMemo(
    () => ({ modals, pushModal, dismissModal }),
    [modals, pushModal, dismissModal],
  );

  return (
    <Context.Provider value={value}>
      {children}
      {modals.map((modal: Modal) => (
        <ModalContainer
          key={modal.id}
          id={modal.id}
          modal={modal}
          dismissModal={() => dismissModal(modal.id)}
        />
      ))}
    </Context.Provider>
  );
}

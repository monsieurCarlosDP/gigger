import {
  Button,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
} from '@mui/material';
import type { ButtonProps } from '@mui/material';
import type { ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';

interface PopperButtonProps {
  /** Button label / content */
  label: ReactNode;
  /** Content rendered inside the popper */
  children: ReactNode | ((close: () => void) => ReactNode);
  /** MUI Button props forwarded to the trigger */
  buttonProps?: Omit<ButtonProps, 'onClick'>;
  /** Popper placement */
  placement?: 'bottom-start' | 'bottom-end' | 'bottom' | 'top-start' | 'top-end' | 'top';
}

export function PopperButton({
  label,
  children,
  buttonProps,
  placement = 'bottom-start',
}: PopperButtonProps) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <Button
        ref={anchorRef}
        onClick={toggle}
        {...buttonProps}
      >
        {label}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement={placement}
        transition
        sx={{ zIndex: 1300 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper elevation={4} sx={{ mt: 0.5 }}>
              <ClickAwayListener onClickAway={close}>
                <div>
                  {typeof children === 'function' ? children(close) : children}
                </div>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

import React, { forwardRef, useEffect, useCallback } from 'react'
import classnames from 'classnames'
import { Transition } from 'react-transition-group'
import Card, { CardProps } from '@material-ui/core/Card'
import { makeStyles, Theme } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { useApp } from 'src/contexts/AppContext'
import { isDarkMode } from 'src/theme/theme'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 4,
    overflow: 'auto',
    transition: 'all 0.15s ease-out',
    background: '#00000070',
    '&.entering': {
      background: 'transparent',
    },
    '&.entered': {
      background: isDarkMode(theme) ? '#0000005a' : '#f4f4f491',
    },
    '&.exiting': {
      background: '#f4f4f491',
    },
    '&.exited': {
      background: 'transparent',
    },
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '2rem',
    display: 'inline-block',
    color: isDarkMode(theme) ? 'white' : '#000',
    opacity: 0.4,
    fontSize: '2rem',
    fontWeight: 'bold',
    zIndex: 1,
    '&:hover': {
      color: '#000',
      opacity: 0.6,
      cursor: 'pointer',
    },
  },
  container: {
    position: 'fixed',
    width: '100%',
    maxWidth: '560px',
    height: 'auto',
    overflow: 'auto',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'all 0.15s ease-out',
    padding: '5rem',
    '&.entering': {
      opacity: 0,
      transform: 'translate(-50%, -50%) scale(0.8)',
    },
    '&.entered': {
      opacity: 1,
      transform: 'translate(-50%, -50%) scale(1)',
    },
    '&.exiting': {
      opacity: 0,
      transform: 'translate(-50%, -50%) scale(0.6)',
    },
    '&.exited': {
      opacity: 0,
      transform: 'translate(-50%, -50%) scale(0)',
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '90%',
    },
  },
  card: {
    position: 'relative',
    padding: 0,
    overflow: 'auto',
    maxHeight: '100%',
    border: isDarkMode(theme) ? '1px solid #353535' : 'none',
    boxShadow: isDarkMode(theme) ? 'none' : theme.boxShadow.card,
  },
  content: {
    padding: '4rem',
    [theme.breakpoints.down('xs')]: {
      padding: '4rem 2rem',
    },
  },
}))

export type ActivityDetailsProps = {
  onClose?: () => void
} & CardProps

const Modal = forwardRef<HTMLElement, Partial<ActivityDetailsProps>>(function Modal(props, ref) {
  const { children, onClose } = props
  const styles = useStyles()
  const { events } = useApp()
  const keypress = events?.keypress
  const handleClose = useCallback(
    (event: any) => {
      // clicking on RaisedSelect component in body seems to exit modal,
      // so this check prevents it
      if (!event?.key && event?.target?.tagName !== 'DIV') {
        return
      }
      if (onClose) {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    keypress?.on('escape', handleClose)
    return () => {
      keypress?.off('escape', handleClose)
    }
  }, [keypress, handleClose])

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Transition
        in={true}
        timeout={{
          appear: 0,
          enter: 0,
          exit: 0,
        }}
        appear={true}
        unmountOnExit={false}
      >
        {(transitionState: string) => (
          <div className={classnames(styles.root, transitionState)}>
            <Transition
              in={true}
              timeout={{
                appear: 0,
                enter: 0,
                exit: 0,
              }}
              appear={true}
              unmountOnExit={false}
            >
              <div className={classnames(styles.container, transitionState)}>
                <ClickAwayListener
                  onClickAway={handleClose}
                  mouseEvent="onMouseDown"
                  touchEvent="onTouchStart"
                >
                  <Card className={styles.card} ref={ref}>
                    <div className={styles.close} onClick={handleClose}>
                      ✕
                    </div>
                    <div className={styles.content}>{children}</div>
                  </Card>
                </ClickAwayListener>
              </div>
            </Transition>
          </div>
        )}
      </Transition>
    </ClickAwayListener>
  )
})

export default Modal

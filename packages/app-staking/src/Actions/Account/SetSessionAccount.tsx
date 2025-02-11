// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, { useContext, useState } from 'react';
import { Button, InputAddress, Input, Modal, TxButton } from '@polkadot/react-components';
import { ApiContext } from '@polkadot/react-api';

import ValidationSessionKey from './InputValidationSessionKey';
import translate from '../../translate';

interface Props extends I18nProps {
  controllerId: string;
  isOpen: boolean;
  onClose: () => void;
  sessionIds: string[];
  stashId: string;
}

const EMPTY_PROOF = new Uint8Array();

function SetSessionKey ({ controllerId, isOpen, onClose, sessionIds, stashId, t }: Props): React.ReactElement<Props> | null {
  const { isSubstrateV2 } = useContext(ApiContext);
  const [ed25519, setEd25519] = useState<string | null>(null);
  const [ed25519Error, setEd25519Error] = useState<string | null>(sessionIds[0] || controllerId);
  const [keys, setKeys] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const hasError = isSubstrateV2
    ? !keys
    : (!ed25519 || !!ed25519Error);

  return (
    <Modal
      className='staking--SetSessionAccount'
      dimmer='inverted'
      open
      size='small'
    >
      <Modal.Header>
        {t('Set Session Key')}
      </Modal.Header>
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
        {isSubstrateV2
          ? (
            <Input
              className='medium'
              help={t('Changing the key only takes effect at the start of the next session. The input here is generates from the author_rotateKeys command')}
              isError={!keys}
              label={t('Keys from rotateKeys')}
              onChange={setKeys}
            />
          )
          : (
            <>
              <InputAddress
                className='medium'
                help={t('Changing the key only takes effect at the start of the next session. If validating, it must be an ed25519 key.')}
                label={t('Session key (ed25519)')}
                onChange={setEd25519}
                value={ed25519}
              />
              <ValidationSessionKey
                controllerId={controllerId}
                onError={setEd25519Error}
                sessionId={ed25519}
                stashId={stashId}
              />
            </>
          )
        }
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            label={t('Cancel')}
            icon='cancel'
          />
          <Button.Or />
          <TxButton
            accountId={controllerId}
            isDisabled={hasError}
            isPrimary
            label={t('Set Session Key')}
            icon='sign-in'
            onClick={onClose}
            params={
              isSubstrateV2
                ? [keys, EMPTY_PROOF]
                : [ed25519]
            }
            tx={
              isSubstrateV2
                ? 'session.setKeys'
                : 'session.setKey'
            }
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(SetSessionKey);

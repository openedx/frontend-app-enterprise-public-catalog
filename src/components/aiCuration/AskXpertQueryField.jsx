import {
  Form,
  Icon,
  IconButton,
} from '@edx/paragon';
import { Send } from '@edx/paragon/icons';
import { useState } from 'react';

import PropTypes from 'prop-types';

const AskXpertQueryField = ({ onSubmit, isDisabled }) => {
  const [textInputValue, setTextInputValue] = useState('');
  return (
    <Form.Group>
      <Form.Control
        placeholder="Describe a skill, competency or job title you are trying to train"
        onClick={(event) => { event.stopPropagation(); }}
        onChange={(event) => { setTextInputValue(event.target.value); }}
        disabled={isDisabled}
        maxLength={300}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === 'NumpadEnter') {
            event.preventDefault();
            if (textInputValue.trim() !== '') {
              onSubmit(textInputValue);
            }
          }
        }}
        size="lg"
        trailingElement={(
          <IconButton
            invertColors
            isActive
            disabled={isDisabled}
            src={Send}
            iconAs={Icon}
            onClick={(event) => {
              event.stopPropagation();
              if (textInputValue.trim() !== '') {
                onSubmit(textInputValue);
              }
            }}
          />
            )}
      />
    </Form.Group>
  );
};

AskXpertQueryField.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

export default AskXpertQueryField;

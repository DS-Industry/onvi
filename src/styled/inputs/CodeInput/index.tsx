import React, {Component, createRef} from 'react';
import {View, TextInput, Text, ViewStyle, TextStyle} from 'react-native';

interface IState {
  focus: number;
  otpText: string[];
}

interface OtpInputProps {
  containerStyle?: ViewStyle;
  inputCount: number;
  tintColor: string;
  offTintColor: string;
  textInputStyle?: ViewStyle;
  inputCellLength: number;
  defaultValue: string;
  handeCallTextChange?: (text: string, i: number) => void;
  handleTextChange?: (text: string) => void;
  onClear?: (clear: () => void) => void;
}

class CodeInput extends Component<OtpInputProps, IState> {
  inputsRef: React.RefObject<TextInput>[] = [];

  static defaultProps: Partial<OtpInputProps> = {
    containerStyle: {},
    inputCount: 4,
    tintColor: 'red',
    offTintColor: 'grey',
    textInputStyle: {},
    inputCellLength: 4,
    defaultValue: '',
    handeCallTextChange: () => {},
    handleTextChange: () => {},
  };

  constructor(props: OtpInputProps) {
    super(props);
    this.inputsRef = Array.from({length: props.inputCount}, () =>
      createRef<TextInput>(),
    );
    this.state = {
      focus: 0,
      otpText: this.getOtpText(
        props.inputCount,
        props.inputCellLength,
        props.defaultValue,
      ),
    };
  }

  getOtpText(inputCount: number, inputCl: number, text: string) {
    let m = text.match(new RegExp('.{1,' + inputCl + '}', 'g')) || [];
    return m.slice(0, inputCount);
  }

  onInputFocus = (i: number) => {
    const prev = i - 1;
    if (prev > -1 && !this.state.otpText[prev]) {
      const previousInput = this.inputsRef[prev].current;
      if (previousInput) {
        previousInput.focus(); // Focus on the previous input
        return;
      }
    }
    this.setState({focus: i}); // Set focus to the current input
  };

  isValidInput = (text: string) => /^[0-9a-zA-Z]+$/.test(text);

  onChangeText = (txt: string, i: number) => {
    if (txt && !this.isValidInput(txt)) {
      return;
    }

    const tempOtpText = [...this.state.otpText];
    tempOtpText[i] = txt;
    this.setState({otpText: tempOtpText});

    this.props.handeCallTextChange && this.props.handeCallTextChange(txt, i);

    if (
      txt.length === this.props.inputCellLength &&
      i !== this.props.inputCount - 1
    ) {
      this.inputsRef[i + 1].current?.focus();
    }

    this.props.handleTextChange &&
      this.props.handleTextChange(tempOtpText.join(''));
  };

  onKeyPress = (e: any, i: number) => {
    const val = this.state.otpText[i] || '';

    if (e.nativeEvent.key !== 'Backspace' && i !== this.props.inputCount - 1) {
      this.inputsRef[i + 1].current?.focus();
      return;
    }

    if (e.nativeEvent.key === 'Backspace' && i !== 0) {
      if (
        !val.length &&
        this.state.otpText[i - 1].length === this.props.inputCellLength
      ) {
        let temp = [...this.state.otpText];
        temp[i - 1] = this.state.otpText[i - 1]
          .split('')
          .splice(0, this.state.otpText[i - 1].length - 1)
          .join('');

        this.setState({otpText: temp});
        this.props.handleTextChange &&
          this.props.handleTextChange(temp.join(''));
        this.inputsRef[i - 1].current?.focus();
      }
    }
  };

  clear = () => {
    this.setState(
      {
        otpText: [],
      },
      () => {
        this.inputsRef[0].current?.focus();
        this.props.handleTextChange && this.props.handleTextChange('');
      },
    );
  };

  render() {
    const {containerStyle, inputCount, tintColor, offTintColor} = this.props;
    const {focus} = this.state;

    const TextInputComponents = Array.from({length: inputCount}).map((_, i) => {
      const _inputStyles: TextStyle | ViewStyle = {
        height: 55,
        width: 55,
        borderBottomWidth: 5,
        margin: 5,
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '600',
        color: 'black',
        borderColor: offTintColor,
      };

      if (focus === i) {
        _inputStyles.borderColor = tintColor;
      }

      return (
        <View key={i} style={{position: 'relative'}}>
          <TextInput
            ref={this.inputsRef[i]}
            style={_inputStyles}
            value={this.state.otpText[i]}
            keyboardType="number-pad"
            maxLength={
              this.state.otpText[i] === '' ? 4 : this.props.inputCellLength
            }
            autoCorrect={false}
            autoFocus={i === 0}
            onFocus={() => this.onInputFocus(i)}
            onChangeText={txt => this.onChangeText(txt, i)}
            onKeyPress={e => this.onKeyPress(e, i)}
            multiline={false}
            textContentType={'oneTimeCode'}
            autoComplete={'sms-otp'}
            caretHidden={true}
          />
          {(this.state.otpText[i] === undefined ||
            this.state.otpText[i] === '') && (
            <Text
              style={{
                position: 'absolute',
                alignSelf: 'center',
                transform: [{translateX: -2.5}, {translateY: -2.5}],
                fontSize: 55,
                color: offTintColor,
              }}>
              •
            </Text>
          )}
        </View>
      );
    });

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'center',
          ...containerStyle,
        }}>
        {TextInputComponents}
      </View>
    );
  }
}

export default CodeInput;

// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import BorderedBox from '../widgets/BorderedBox';
import paperWalletPage1 from '../../assets/pdf/paper-wallet-certificate-page-1.png';
import paperWalletPage2 from '../../assets/pdf/paper-wallet-certificate-page-2.png';
import styles from './PaperWallet.scss';

// Assign pdfFonts to pdfMaker
Object.assign(pdfMake, pdfFonts.pdfMake);
Object.assign(pdfMake.default, pdfFonts.default.pdfMake);

type Props = {
  walletName: string,
  walletAddress: string,
};

type State = {
  isGeneratingPDF: boolean,
}

// define your function for generating rotated text
const writeRotatedText = ({ text, width, height }) => {
  const verticalSpacing = 3;
  const fontSize = height - verticalSpacing;
  const qualityMultiplier = 4;
  // ^^ qualityMultiplier is used to generate HQ canvas and then fit it to A4 page width
  const canvas = document.createElement('canvas');
  canvas.width = width * qualityMultiplier;
  canvas.height = height * qualityMultiplier;
  const ctx = canvas.getContext('2d');
  ctx.font = `${fontSize * qualityMultiplier}pt Arial`;
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, -1);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#3b5c9b';
  ctx.fillText(text, canvas.width / 2, -verticalSpacing * qualityMultiplier);
  ctx.restore();
  return canvas.toDataURL();
};

@observer
export default class PaperWallet extends Component<Props, State> {

  state = {
    isGeneratingPDF: false,
  };

  docDefinition = {
    content: [
      // 1st page - Public key
      { // Page background
        image: paperWalletPage1,
        absolutePosition: { x: 0, y: 0 },
        width: 595.28,
        height: 841.89,
      },
      { // Wallet address
        image: writeRotatedText({ text: 'Wallet address', width: 500, height: 10 }),
        fit: [500, 10],
        alignment: 'center',
        absolutePosition: { x: 0, y: 620 },
      },
      { // Wallet address QR code
        qr: 'DdzFFzCqrhtBmXCm2p4cX1rZ72HZb5cTucVpDynjmjDyzLUDmLa53KYSa2hew1Ew1KytXjCdicFehohasAqPL2j4qV4vSL4kaEjMnKBq', // this.props.walletAddress,
        alignment: 'center',
        background: '#f8fbfd',
        fit: 80,
        foreground: '#3b5c9b',
        absolutePosition: { x: 0, y: 540 },
      },
      { // Wallet address - line 1
        image: writeRotatedText({ text: 'DdzFFzCqrhtBmXCm2p4cX1rZ72HZb5cTucVpDynjmjDyzLUDmLa5', width: 500, height: 8 }),
        fit: [500, 8],
        alignment: 'center',
        absolutePosition: { x: 0, y: 525 },
      },
      { // Wallet address - line 2
        image: writeRotatedText({ text: '3KYSa2hew1Ew1KytXjCdicFehohasAqPL2j4qV4vSL4kaEjMnKBq', width: 500, height: 8 }),
        fit: [500, 8],
        alignment: 'center',
        absolutePosition: { x: 0, y: 515 },
      },
      { // Daedalus version and build
        image: writeRotatedText({ text: 'Daedalus 0.9.0#1.1.0.408', width: 100, height: 8 }),
        fit: [100, 8],
        absolutePosition: { x: 343, y: 493 },
      },
      // 2nd page - Private key
      { // Page background
        image: paperWalletPage2,
        absolutePosition: { x: 0, y: 0 },
        width: 595.28,
        height: 841.89,
        pageBreak: 'before',
      },
      { // Shielded recovery phrase
        image: writeRotatedText({ text: 'Shielded recovery phrase', width: 500, height: 10 }),
        fit: [500, 10],
        alignment: 'center',
        absolutePosition: { x: 0, y: 270 },
      },
      { // Shielded recovery phrase - word 1
        image: writeRotatedText({ text: 'mnemonic-1', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 375, y: 245 },
      },
      { // Shielded recovery phrase - word 2
        image: writeRotatedText({ text: 'mnemonic-2', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 325, y: 245 },
      },
      { // Shielded recovery phrase - word 3
        image: writeRotatedText({ text: 'mnemonic-3', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 275, y: 245 },
      },
      { // Shielded recovery phrase - word 4
        image: writeRotatedText({ text: 'mnemonic-4', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 225, y: 245 },
      },
      { // Shielded recovery phrase - word 5
        image: writeRotatedText({ text: 'mnemonic-5', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 175, y: 245 },
      },
      { // Shielded recovery phrase - word 6
        image: writeRotatedText({ text: 'mnemonic-6', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 375, y: 230 },
      },
      { // Shielded recovery phrase - word 7
        image: writeRotatedText({ text: 'mnemonic-7', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 325, y: 230 },
      },
      { // Shielded recovery phrase - word 8
        image: writeRotatedText({ text: 'mnemonic-8', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 275, y: 230 },
      },
      { // Shielded recovery phrase - word 9
        image: writeRotatedText({ text: 'mnemonic-9', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 225, y: 230 },
      },
      { // Shielded recovery phrase - word 10
        image: writeRotatedText({ text: 'mnemonic-10', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 175, y: 230 },
      },
      { // Shielded recovery phrase - word 11
        image: writeRotatedText({ text: 'mnemonic-11', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 375, y: 215 },
      },
      { // Shielded recovery phrase - word 12
        image: writeRotatedText({ text: 'mnemonic-12', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 325, y: 215 },
      },
      { // Shielded recovery phrase - word 13
        image: writeRotatedText({ text: 'mnemonic-13', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 275, y: 215 },
      },
      { // Shielded recovery phrase - word 14
        image: writeRotatedText({ text: 'mnemonic-14', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 225, y: 215 },
      },
      { // Shielded recovery phrase - word 15
        image: writeRotatedText({ text: 'mnemonic-15', width: 50, height: 8 }),
        fit: [50, 8],
        absolutePosition: { x: 175, y: 215 },
      },
      { // Password
        image: writeRotatedText({ text: 'Password', width: 500, height: 10 }),
        fit: [500, 10],
        alignment: 'center',
        absolutePosition: { x: 0, y: 180 },
      },
    ],
    pageMargins: [0, 0],
    pageSize: 'A4',
  };

  downloadPaperWallet = () => {
    this.setState({ isGeneratingPDF: true });
    setTimeout(() => { // Timeout is used to allow enought time for button text re-rendering
      pdfMake.createPdf(this.docDefinition).download('paper-wallet.pdf', () => {
        this.setState({ isGeneratingPDF: false });
      });
    }, 100);
  };

  render() {
    const {
      walletName, walletAddress,
    } = this.props;
    const { isGeneratingPDF } = this.state;

    return (
      <div className={styles.component}>

        <BorderedBox>

          <h1>Paper Wallet</h1>
          <p>Wallet name: {walletName}</p>
          <p>Private key: abcdefghijklmnopqrstuvwxyz1234567890</p>
          <p>Public key: {walletAddress}</p>
          <button
            onClick={this.downloadPaperWallet}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? 'Generating Paper Wallet PDF' : 'Download Paper Wallet'}
          </button>

        </BorderedBox>

      </div>
    );
  }

}

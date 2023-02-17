import { Input, Descriptions, Table, message } from 'antd';
import { useState } from 'react'
import copy from 'copy-to-clipboard';
import logo from '../logo.svg';

const { Search } = Input;

function Home() {

  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  const onSearch = (value) => {
    // https://blockchain.info/rawblock/00000000000000000007878ec04bb2b2e12317804810f4c26033585b3f81ffaa
    setLoading(true)
    fetch(`https://blockchain.info/rawblock/${value}`)
    .then(res => {
      if (res.status == 200) {
        return res.json()
      }
    })
    .then(res => {
      let list = res.tx;
      list.forEach((item, index) => {
        item.key = index
      })
      setData(res)
      setLoading(false)
    })
    .catch(error => {
      setLoading(false)
      setData()
    })
  };

  const timeFormatter = (time) => {
    let date = new Date(time)
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();
    date = date.toLocaleDateString()
    return `${date}, ${hour}:${min}:${sec}`
  }

  const copyHash = (hash) => {
    copy(hash)
    message.success('Copied To Clipboard!')
  }

  const description = (data) => 
    <Descriptions title="Details" style={{textAlign: 'left'}}>
      <Descriptions.Item label="Hash">
        <span>{data.hash.slice(0,4)}-{data.hash.slice(-4, )}</span>
        <img
        onClick={() => copyHash(data.hash)}
        src="https://www.blockchain.com/explorer/_next/static/media/copy.f3aae740.svg"
        style={Styles.svgStyle} />
      </Descriptions.Item>
      <Descriptions.Item label="Bits">{data.bits}</Descriptions.Item>
      <Descriptions.Item label="Block index">{data.block_index}</Descriptions.Item>
      <Descriptions.Item label="Fee">{data.fee}</Descriptions.Item>
      <Descriptions.Item label="Weight">{data.weight}</Descriptions.Item>
      <Descriptions.Item label="Height">{data.height}</Descriptions.Item>
      <Descriptions.Item label="Mrkl Root">
        <span>{data.mrkl_root.slice(0,4)}-{data.mrkl_root.slice(-4, )}</span>
        <img
        onClick={() => copyHash(data.mrkl_root)}
        src="https://www.blockchain.com/explorer/_next/static/media/copy.f3aae740.svg"
        style={Styles.svgStyle} />
      </Descriptions.Item>
      <Descriptions.Item label="N tx">{data.n_tx}</Descriptions.Item>
      <Descriptions.Item label="Nonce">{data.nonce}</Descriptions.Item>
      <Descriptions.Item label="Size">{data.size}</Descriptions.Item>
      <Descriptions.Item label="Ver">{data.ver}</Descriptions.Item>
    </Descriptions>

  const columns = [
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
      render: (text, record) => {
        return(
          <>
            
            {record.key}&nbsp;
            <span style={Styles.fontColor}>ID: </span>
            <span style={Styles.hashColor}>{text.slice(0,4)}-{text.slice(-4, )}</span>
            <img
            onClick={() => copyHash(text)}
            src="https://www.blockchain.com/explorer/_next/static/media/copy.f3aae740.svg"
            style={Styles.svgStyle} />
            <br/>
            <span style={Styles.fontColor}>{timeFormatter(record.time)}</span>
          </>
        )

      }
    },
    {
      title: 'IO',
      dataIndex: 'inputs',
      responsive: ['md'],
      render: (text, record) => {
        let input = text.length > 1
                    ? <span style={Styles.fontColor}>{text.length} Inputs</span>
                    : text[0].prev_out.addr
                    ? <>
                        <span style={Styles.hashColor}>{text[0].prev_out.addr.slice(0,4)}-{text[0].prev_out.addr.slice(-4, )}</span>
                        <img
                        onClick={() => copyHash(text[0].prev_out.addr)}
                        src="https://www.blockchain.com/explorer/_next/static/media/copy.f3aae740.svg"
                        style={Styles.svgStyle} />
                      </>
                    : <span style={Styles.fontColor}>Block Reward</span>
        let output = record.out.length > 1
                    ? <span style={Styles.fontColor}>{record.out.length} Outputs</span>
                    : <>
                        <span style={Styles.hashColor}>{record.out[0].addr.slice(0,4)}-{record.out[0].addr.slice(-4, )}</span>
                        <img
                        onClick={() => copyHash(record.out[0].addr)}
                        src="https://www.blockchain.com/explorer/_next/static/media/copy.f3aae740.svg"
                        style={Styles.svgStyle} />
                    </>
                    
                    
        return (
          <>
            Form {input}
            <br/>
            To {output}
          </>
        )

      }
    },
    {
      title: 'Value',
      dataIndex: 'out',
      render: (text, record) => {
        let value = 0;
        text.forEach(ele => value += ele.value);
        return (
          <>
            {value/100000000} <span style={Styles.fontColor}> BTC • ${value}</span>
            <br/>
            <span style={Styles.feeColor}>Fee</span> {record.fee/1000}K Sats<span style={Styles.fontColor}> • ${record.fee}</span>
          </>
        )
      },
    },
    Table.EXPAND_COLUMN,
  ];

  const InItemRender = (itemData, index) => {
    return(
      <div style={{display: 'flex'}}>
        <div style={{marginRight: '10px', fontWeight: 600}}>{index+1}</div>
        <div>
          
          {
            itemData.prev_out.addr
            ? <span style={Styles.hashColor} className='hashStyle'>{itemData.prev_out.addr}</span>
            : <span style={Styles.fontColor}>Block Reward</span>
          }
          {
            itemData.prev_out.addr &&
            <img
              onClick={() => copyHash(itemData.prev_out.addr)}
              src="https://www.blockchain.com/explorer/_next/static/media/copy.f3aae740.svg"
              style={Styles.svgStyle} />
          }
          <br/>
          {itemData.prev_out.value/100000000} <span style={Styles.fontColor}> BTC • ${itemData.prev_out.value}</span>
          <br/>
        </div>
      </div>
    )
  }

  const OutItemRender = (itemData, index) => {
    return(
      <div style={{display: 'flex'}}>
        <div style={{marginRight: '10px', fontWeight: 600}}>{index+1}</div>
        <div>
          
          {
            itemData.addr
            ? <span style={Styles.hashColor} className='hashStyle'>{itemData.addr}</span>
            : <span style={Styles.fontColor}>None</span>
          }
          {
            itemData.addr &&
            <img
              onClick={() => copyHash(itemData.addr)}
              src="https://www.blockchain.com/explorer/_next/static/media/copy.f3aae740.svg"
              style={Styles.svgStyle} />
          }
          <br/>
          {itemData.value/100000000} <span style={Styles.fontColor}> BTC • ${itemData.value}</span>
          <br/>
        </div>
      </div>
    )
  }

  return (

    <div style = {Styles.outline}>
      <img src={logo} className="app-logo" alt="logo" />
      <div>
        {/* search */}
        <div style={Styles.searchOutline}>
          <Search
            style={Styles.search}
            size='large'
            placeholder="Block Hash"
            maxLength={100}
            onSearch={onSearch}
            loading={loading}
            enterButton />
        </div>

        <div style={Styles.content}>
          {
            data 
            ? <>
                {/* detail */}
                <div>
                  {description(data)}
                </div>
                {/* table */}
                <div>
                  <p style={Styles.tableTitle}>Transactions</p>
                  <Table
                    columns={columns}
                    showHeader={false}
                    pagination={{showSizeChanger: false}}
                    style={{width: 'calc(100vw - 80px)'}}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div style={Styles.expand}>
                          <div style={Styles.leftPart} className='leftPart'>
                            <span style={{fontWeight: 600}}>From</span><br/>
                            {
                              record.inputs.map((item, index) => InItemRender(item, index))
                            }                        
                          </div>

                          <div style={Styles.rightPart} className='rightPart'>
                            <span style={{fontWeight: 600}}>To</span><br/>
                            {
                              record.out.map((item, index) => OutItemRender(item, index))
                            }
                          </div>
                        </div>
                      ),
                    }}
                    dataSource={data.tx}
                  />
                </div>
              </>
            : <img style={Styles.noneData} src='/src/img/noneData.webp' />
          }
        </div>
      </div>
    </div>
  );
}
 const Styles = {
  outline: {
    padding: '20px',
    minHeight: '100vh',
    backgroundColor: '#F6F6F6',
    boxSizing: 'border-box',
  },

  searchOutline: {
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    textAlign: 'center',
    padding: '20px',
  },

  search: {
    width: '60vw',
  },

  content: {
    textAlign: 'center',
    marginTop: '20px',
    padding: '20px',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
  },

  noneData: {
    width: '30vw',
  },

  tableTitle: {
    textAlign: 'left',
    fontWeight: 600,
  },

  fontColor: {
    color: 'rgb(153, 153, 153)',
  },

  hashColor: {
    color: 'rgb(237, 155, 96)',
  },

  feeColor: {
    color: 'rgb(244, 91, 105)',
  },
  svgStyle: {
    width: '10px',
    height: '10px',
    color: '#999999',
    cursor: 'pointer',
    marginLeft: '5px',
  },

  expand: {
    display: 'flex'
  },

  leftPart: {
    minHeight: '90px',
    borderRight: '1px solid #dddddd',
  },

  rightPart: {
    paddingLeft: '20px',
  },
 }

export default Home;

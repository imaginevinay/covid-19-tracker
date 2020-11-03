import React from 'react'
import './Table.css'
import numeral from 'numeral'

function Table({ countries, casesType = 'cases' }) {
    // const [caseType, setcaseType] = useState(casesType)
    // useEffect(() => {
    //    setcaseType(casesType)
    // }, [casesType])
    return (
        <div className="table">
            {console.log('table data??', countries)}
            {
                countries.map(country => (
                    <tr>
                        <td>{country.country}</td>
                        <td>
                            <strong>
                                {
                                numeral(country[casesType]).format('0,0')
                                }
                            </strong>
                        </td>
                    </tr>

                ))
            }
        </div>
    )
}

export default Table

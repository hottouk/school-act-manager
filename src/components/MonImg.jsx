//이미지
import mon_01 from "../image/enemies/mon_01.png"
import mon_02 from "../image/enemies/mon_02.png"
import mon_03 from "../image/enemies/mon_03.png"
import mon_04 from "../image/enemies/mon_04.png"
import mon_05 from "../image/enemies/mon_05.png"
import question from "../image/icon/question.png"

const MonImg = (props) => {
  return (<>
    {(props.monImg && <>
      {(props.monImg === "mon_01") && <img src={mon_01} alt="몬이미지" />}
      {(props.monImg === "mon_02") && <img src={mon_02} alt="몬이미지" />}
      {(props.monImg === "mon_03") && <img src={mon_03} alt="몬이미지" />}
      {(props.monImg === "mon_04") && <img src={mon_04} alt="몬이미지" />}
      {(props.monImg === "mon_05") && <img src={mon_05} alt="몬이미지" />}
    </>)}
    {!props.monImg && <img src={question} alt="몬이미지" />}
  </>)
}

export default MonImg
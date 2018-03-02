import styled from 'styled-components';

export const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 5px 25px;
  opacity: 1;

	@media only screen and (max-width: 480px) {
		padding: 5px 0px;
	}
`;

export const ToggleName = styled.div`
  color: #FFFFFF;
  display: inline-block;
  font-family: DIN;
  font-size: 13px;
  font-weight: bold;
  line-height: 25px;
  margin-left: 10px;
  opacity: 0.5;
`;

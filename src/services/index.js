import ApiAdapter from '../adapters/api.adapter';
import SpellCheck from './spellCheck.service';

const apiAdapter = new ApiAdapter();

const spellCheckService = new SpellCheck(apiAdapter);

export default spellCheckService;

package org.batfish.z3;

import java.util.Map;
import org.batfish.common.BatfishLogger;
import org.batfish.common.BatfishLogger.BatfishLoggerHistory;
import org.batfish.datamodel.answers.NodFirstUnsatAnswerElement;
import org.batfish.job.BatfishJobResult;

public class NodFirstUnsatResult<KeyT, ResultT>
    extends BatfishJobResult<Map<KeyT, ResultT>, NodFirstUnsatAnswerElement> {

  private final Integer _firstUnsatQueryIndex;

  private final KeyT _key;

  private final ResultT _result;

  public NodFirstUnsatResult(
      KeyT key,
      Integer firstUnsatQueryIndex,
      ResultT result,
      BatfishLoggerHistory history,
      long elapsedTime) {
    super(elapsedTime, history);
    _firstUnsatQueryIndex = firstUnsatQueryIndex;
    _key = key;
    _result = result;
  }

  public NodFirstUnsatResult(
      long elapsedTime, BatfishLoggerHistory history, Throwable failureCause) {
    super(elapsedTime, history, failureCause);
    _key = null;
    _result = null;
    _firstUnsatQueryIndex = null;
  }

  @Override
  public void appendHistory(BatfishLogger logger) {
    logger.append(_history);
  }

  @Override
  public void applyTo(
      Map<KeyT, ResultT> output, BatfishLogger logger, NodFirstUnsatAnswerElement answerElement) {
    output.put(_key, _result);
  }

  @Override
  public String toString() {
    if (_key == null) {
      return "<FAILED>";
    } else if (_firstUnsatQueryIndex != null) {
      return "<FIRST_UNSAT: " + _firstUnsatQueryIndex + ":" + _result + ">";
    } else {
      return "<ALL_SAT>";
    }
  }
}
